import { useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, User, Tag, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetReel, useIncrementViewCount } from '../hooks/useQueries';

export function ReelDetailPage() {
  const { id } = useParams({ from: '/reel/$id' });
  const navigate = useNavigate();
  const reelId = BigInt(id);

  const { data: reel, isLoading, isError } = useGetReel(reelId);
  const incrementViewCount = useIncrementViewCount();

  useEffect(() => {
    if (reel) {
      incrementViewCount.mutate(reelId);
    }
    // Only run once when reel is first loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel?.id]);

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-5 w-24 bg-cinema-grey mb-6" />
        <Skeleton className="w-full aspect-video bg-cinema-grey rounded mb-6" />
        <Skeleton className="h-8 w-2/3 bg-cinema-grey mb-3" />
        <Skeleton className="h-4 w-1/3 bg-cinema-grey mb-6" />
        <Skeleton className="h-20 w-full bg-cinema-grey" />
      </main>
    );
  }

  if (isError || !reel) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-3xl font-black text-foreground mb-3">REEL NOT FOUND</h2>
        <p className="text-muted-foreground font-body mb-6">This reel doesn't exist or has been removed.</p>
        <Button
          onClick={() => navigate({ to: '/browse' })}
          className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-wider"
        >
          BROWSE REELS
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-glow transition-colors duration-200 font-body mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Link>

      {/* Video Player */}
      <div className="relative w-full aspect-video bg-cinema-black rounded overflow-hidden mb-6 shadow-glow-sm border border-border">
        {reel.videoUrl ? (
          <iframe
            src={reel.videoUrl}
            title={reel.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <ExternalLink className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground font-body text-sm">No video URL provided</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3 leading-tight">
            {reel.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-muted-foreground font-body">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-glow" />
              {reel.uploader || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-glow" />
              {Number(reel.viewCount).toLocaleString()} views
            </span>
          </div>

          {/* Description */}
          {reel.description && (
            <div className="bg-cinema-dark border border-border rounded p-4 mb-5">
              <p className="text-sm text-muted-foreground font-body leading-relaxed whitespace-pre-wrap">
                {reel.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {reel.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-amber-glow flex-shrink-0" />
              {reel.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-amber-glow/30 text-amber-glow bg-amber-glow/5 font-body text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-cinema-dark border border-border rounded p-5 space-y-4">
            <h3 className="font-display text-sm font-bold tracking-widest text-amber-glow">REEL INFO</h3>
            <div className="space-y-3 text-sm font-body">
              <div>
                <span className="text-muted-foreground block text-xs tracking-wider mb-0.5">CREATOR</span>
                <span className="text-foreground font-semibold">{reel.uploader || 'Anonymous'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs tracking-wider mb-0.5">VIEWS</span>
                <span className="text-foreground font-semibold">{Number(reel.viewCount).toLocaleString()}</span>
              </div>
              {reel.tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground block text-xs tracking-wider mb-1">TAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {reel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded-sm bg-cinema-grey text-amber-glow border border-amber-glow/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <Link to="/browse">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-cinema-grey font-display font-bold tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  BROWSE MORE
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
