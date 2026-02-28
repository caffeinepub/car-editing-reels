import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Upload, CheckCircle, AlertCircle, ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitReel } from '../hooks/useQueries';
import type { NewReel } from '../backend';

interface FormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  uploader: string;
  tagsInput: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  videoUrl?: string;
  uploader?: string;
}

export function UploadPage() {
  const navigate = useNavigate();
  const submitReel = useSubmitReel();

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    uploader: '',
    tagsInput: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successId, setSuccessId] = useState<bigint | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    const tag = form.tagsInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setForm((prev) => ({ ...prev, tagsInput: '' }));
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.videoUrl.trim()) newErrors.videoUrl = 'Video URL is required.';
    if (!form.uploader.trim()) newErrors.uploader = 'Creator name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newReel: NewReel = {
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
      uploader: form.uploader.trim(),
      tags,
    };

    try {
      const id = await submitReel.mutateAsync(newReel);
      setSuccessId(id);
    } catch (err) {
      console.error('Failed to submit reel:', err);
    }
  };

  const handleReset = () => {
    setForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', uploader: '', tagsInput: '' });
    setTags([]);
    setErrors({});
    setSuccessId(null);
  };

  if (successId !== null) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-cinema-dark border border-amber-glow/30 rounded-lg p-10 shadow-glow-sm">
          <CheckCircle className="w-16 h-16 text-amber-glow mx-auto mb-5" />
          <h2 className="font-display text-4xl font-black text-foreground mb-3">
            REEL <span className="text-amber-glow">SUBMITTED!</span>
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Your reel has been added to the collection. The community can now discover your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate({ to: '/reel/$id', params: { id: successId.toString() } })}
              className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-wider shadow-glow-sm"
            >
              VIEW YOUR REEL
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border text-foreground hover:bg-cinema-grey font-display font-bold tracking-wider"
            >
              SUBMIT ANOTHER
            </Button>
            <Link to="/browse">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground font-display font-bold tracking-wider w-full"
              >
                BROWSE REELS
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-glow transition-colors duration-200 font-body mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-5 h-5 text-amber-glow" />
          <h1 className="font-display text-4xl font-black tracking-wide text-foreground">
            SUBMIT A <span className="text-amber-glow">REEL</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-body">
          Share your car editing reel with the community. Paste a YouTube or Vimeo embed URL.
        </p>
      </div>

      {/* Error banner */}
      {submitReel.isError && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive font-body">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Failed to submit reel. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            TITLE <span className="text-amber-glow">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Tokyo Drift Night Edit"
            className={`bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body ${errors.title ? 'border-destructive' : ''}`}
          />
          {errors.title && <p className="text-xs text-destructive font-body">{errors.title}</p>}
        </div>

        {/* Creator */}
        <div className="space-y-1.5">
          <Label htmlFor="uploader" className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            CREATOR NAME <span className="text-amber-glow">*</span>
          </Label>
          <Input
            id="uploader"
            value={form.uploader}
            onChange={(e) => updateField('uploader', e.target.value)}
            placeholder="Your name or handle"
            className={`bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body ${errors.uploader ? 'border-destructive' : ''}`}
          />
          {errors.uploader && <p className="text-xs text-destructive font-body">{errors.uploader}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            DESCRIPTION <span className="text-amber-glow">*</span>
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Tell us about this reel — the car, the vibe, the story..."
            rows={4}
            className={`bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body resize-none ${errors.description ? 'border-destructive' : ''}`}
          />
          {errors.description && <p className="text-xs text-destructive font-body">{errors.description}</p>}
        </div>

        {/* Video URL */}
        <div className="space-y-1.5">
          <Label htmlFor="videoUrl" className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            VIDEO EMBED URL <span className="text-amber-glow">*</span>
          </Label>
          <Input
            id="videoUrl"
            value={form.videoUrl}
            onChange={(e) => updateField('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/... or https://player.vimeo.com/video/..."
            className={`bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body ${errors.videoUrl ? 'border-destructive' : ''}`}
          />
          {errors.videoUrl && <p className="text-xs text-destructive font-body">{errors.videoUrl}</p>}
          <p className="text-xs text-muted-foreground font-body">
            Use YouTube embed format: <span className="text-amber-glow/80">youtube.com/embed/VIDEO_ID</span>
          </p>
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-1.5">
          <Label htmlFor="thumbnailUrl" className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            THUMBNAIL URL <span className="text-muted-foreground text-xs font-body normal-case">(optional)</span>
          </Label>
          <Input
            id="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={(e) => updateField('thumbnailUrl', e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
            className="bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label className="font-display font-bold tracking-wider text-xs text-muted-foreground">
            TAGS <span className="text-muted-foreground text-xs font-body normal-case">(optional)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={form.tagsInput}
              onChange={(e) => updateField('tagsInput', e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g. JDM, Drift, Night..."
              className="bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow font-body"
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              size="icon"
              className="border-amber-glow/50 text-amber-glow hover:bg-amber-glow/10 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-body">Press Enter or comma to add a tag.</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-cinema-grey border border-amber-glow/30 text-amber-glow rounded-sm font-body"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitReel.isPending}
            className="w-full bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-black tracking-widest text-base py-6 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 disabled:opacity-60"
          >
            {submitReel.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-cinema-black/30 border-t-cinema-black rounded-full animate-spin" />
                SUBMITTING...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                SUBMIT REEL
              </span>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}
