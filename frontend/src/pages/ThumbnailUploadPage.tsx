import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGetAllImages, useUploadImage, useDeleteImage } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { StoredImage } from '../backend';

type UploadState = 'idle' | 'preview' | 'uploading' | 'success' | 'error';

export function ThumbnailUploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images, isLoading: imagesLoading } = useGetAllImages();
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  // Get the most recent stored image (only one active at a time)
  const storedImage: StoredImage | null =
    images && images.length > 0
      ? images.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0]
      : null;

  // Load the stored image URL
  useEffect(() => {
    if (storedImage && uploadState === 'idle') {
      const url = storedImage.blob.getDirectURL();
      setActiveImageUrl(url);
    }
  }, [storedImage, uploadState]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'image/png') {
      return 'Only PNG files are accepted. Please select a .png file.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be under 10 MB.';
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setUploadState('error');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);

    // Create preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadState('preview');
  }, [previewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      // Cast to Uint8Array<ArrayBuffer> to satisfy the strict type requirement
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;

      // If there's an existing image, delete it first
      if (storedImage) {
        await deleteMutation.mutateAsync(storedImage.id);
      }

      await uploadMutation.mutateAsync({
        bytes,
        onProgress: (pct) => setUploadProgress(pct),
      });

      setUploadState('success');
      setUploadProgress(100);
      toast.success('Thumbnail uploaded successfully!');

      // Clean up preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
    } catch (err: any) {
      setUploadState('error');
      setValidationError(err?.message ?? 'Upload failed. Please try again.');
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setValidationError(null);
    setUploadState('idle');
  };

  const handleDelete = async () => {
    if (!storedImage) return;
    try {
      await deleteMutation.mutateAsync(storedImage.id);
      setActiveImageUrl(null);
      setUploadState('idle');
      toast.success('Thumbnail deleted.');
    } catch (err: any) {
      toast.error('Failed to delete thumbnail.');
    }
  };

  const handleReplace = () => {
    setUploadState('idle');
    setValidationError(null);
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  const zoneClass = [
    'upload-zone',
    dragOver ? 'upload-zone-active' : '',
    uploadState === 'error' ? 'upload-zone-error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // ── Render: Success / Active Image ──────────────────────────────────────────
  if (uploadState === 'success' || (uploadState === 'idle' && storedImage && activeImageUrl)) {
    const displayUrl = uploadState === 'success'
      ? (storedImage?.blob.getDirectURL() ?? activeImageUrl)
      : activeImageUrl;

    return (
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Thumbnail Uploader
            </h1>
            <p className="text-ink-3 font-body text-sm">
              Upload and manage your PNG thumbnail
            </p>
          </div>

          <div className="bg-surface-1 rounded-2xl shadow-md overflow-hidden border border-border animate-fade-in">
            {/* Success banner */}
            {uploadState === 'success' && (
              <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-green-700">
                  Thumbnail uploaded successfully
                </span>
              </div>
            )}

            {/* Image preview */}
            <div className="p-5">
              <div className="rounded-xl overflow-hidden bg-surface-2 border border-border aspect-video flex items-center justify-center">
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt="Uploaded thumbnail"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-ink-3">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-sm">Loading preview…</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-ink-2 hover:text-foreground font-body"
                onClick={handleReplace}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Replace Thumbnail
              </Button>
              <Button
                variant="destructive"
                className="flex-1 font-body"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete Thumbnail
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Render: Upload Zone ──────────────────────────────────────────────────────
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Thumbnail Uploader
          </h1>
          <p className="text-ink-3 font-body text-sm">
            Upload a single PNG thumbnail — drag & drop or click to browse
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-surface-1 rounded-2xl shadow-md border border-border overflow-hidden">
          {/* Drop zone */}
          <div className="p-6">
            <div
              className={`${zoneClass} rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[260px] transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (uploadState !== 'uploading') fileInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
              aria-label="Upload zone — click or drag a PNG file here"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={handleInputChange}
              />

              {/* ── State: Idle ── */}
              {uploadState === 'idle' && !imagesLoading && (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue-pale flex items-center justify-center">
                    <Upload className="w-7 h-7 text-brand-blue" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-base font-semibold text-foreground mb-1">
                      {dragOver ? 'Drop your PNG here' : 'Drag & drop your PNG here'}
                    </p>
                    <p className="text-sm text-ink-3 font-body">
                      or{' '}
                      <span className="text-brand-blue font-medium underline underline-offset-2">
                        click to browse
                      </span>
                    </p>
                    <p className="text-xs text-ink-3 font-body mt-2">
                      PNG only · Max 10 MB
                    </p>
                  </div>
                </>
              )}

              {/* ── State: Loading existing images ── */}
              {imagesLoading && (
                <div className="flex flex-col items-center gap-3 text-ink-3">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                  <span className="text-sm font-body">Loading…</span>
                </div>
              )}

              {/* ── State: Preview ── */}
              {uploadState === 'preview' && previewUrl && (
                <div className="w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="w-full rounded-lg overflow-hidden border border-border bg-surface-2 aspect-video flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-2 font-body">
                    <ImageIcon className="w-4 h-4 text-brand-blue shrink-0" />
                    <span className="truncate max-w-[240px]">{selectedFile?.name}</span>
                    <span className="text-ink-3 shrink-0">
                      ({selectedFile ? (selectedFile.size / 1024).toFixed(0) : 0} KB)
                    </span>
                  </div>
                </div>
              )}

              {/* ── State: Uploading ── */}
              {uploadState === 'uploading' && (
                <div
                  className="w-full flex flex-col items-center gap-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue-pale flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-brand-blue animate-spin" />
                  </div>
                  <div className="w-full max-w-xs text-center">
                    <p className="text-sm font-medium text-foreground mb-3 font-body">
                      Uploading thumbnail…
                    </p>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-ink-3 mt-2 font-body">{uploadProgress}%</p>
                  </div>
                </div>
              )}

              {/* ── State: Error ── */}
              {uploadState === 'error' && (
                <div className="flex flex-col items-center gap-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-destructive font-body mb-1">
                      {validationError ?? 'Something went wrong'}
                    </p>
                    <p className="text-xs text-ink-3 font-body">
                      Click to try again with a different file
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action bar — shown in preview state */}
          {uploadState === 'preview' && (
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                className="flex-1 border-border text-ink-2 hover:text-foreground font-body"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1 bg-brand-blue hover:bg-brand-blue-light text-white font-body font-medium"
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </Button>
            </div>
          )}

          {/* Hint text */}
          {(uploadState === 'idle' || uploadState === 'error') && !imagesLoading && (
            <div className="px-6 pb-5 text-center">
              <p className="text-xs text-ink-3 font-body">
                Only one thumbnail can be stored at a time. Uploading a new one will replace the existing thumbnail.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
