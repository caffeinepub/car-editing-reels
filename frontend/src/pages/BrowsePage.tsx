import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, SlidersHorizontal, X, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReelCard } from '../components/ReelCard';
import { useGetAllReels } from '../hooks/useQueries';
import type { Reel } from '../backend';

const POPULAR_TAGS = ['JDM', 'Supercar', 'Drift', 'Stance', 'Muscle', 'Luxury', 'Track', 'Street', 'Cinematic', 'Night'];

export function BrowsePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data: allReels, isLoading } = useGetAllReels();

  const filteredReels = useMemo(() => {
    if (!allReels) return [];
    let result: Reel[] = [...allReels];

    if (activeTag) {
      result = result.filter((reel) =>
        reel.tags.some((tag) => tag.toLowerCase().includes(activeTag.toLowerCase()))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (reel) =>
          reel.title.toLowerCase().includes(q) ||
          reel.description.toLowerCase().includes(q) ||
          reel.uploader.toLowerCase().includes(q) ||
          reel.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allReels, activeTag, searchQuery]);

  const handleReelClick = (id: bigint) => {
    navigate({ to: '/reel/$id', params: { id: id.toString() } });
  };

  const clearFilters = () => {
    setActiveTag(null);
    setSearchQuery('');
  };

  const hasFilters = !!activeTag || !!searchQuery.trim();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Grid3X3 className="w-5 h-5 text-amber-glow" />
          <h1 className="font-display text-4xl font-black tracking-wide text-foreground">
            BROWSE <span className="text-amber-glow">REELS</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-body">
          Explore all submitted car editing reels from the community.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reels, creators, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-cinema-dark border-border text-foreground placeholder:text-muted-foreground focus:border-amber-glow focus:ring-amber-glow/20 font-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded-sm border transition-all duration-200 ${
              !activeTag
                ? 'bg-amber-glow text-cinema-black border-amber-glow shadow-glow-sm'
                : 'bg-transparent text-muted-foreground border-border hover:border-amber-glow/50 hover:text-foreground'
            }`}
          >
            ALL
          </button>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded-sm border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-amber-glow text-cinema-black border-amber-glow shadow-glow-sm'
                  : 'bg-transparent text-muted-foreground border-border hover:border-amber-glow/50 hover:text-foreground'
              }`}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Active filter summary */}
        {hasFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-body">
              {filteredReels.length} result{filteredReels.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-amber-glow hover:text-amber-bright font-body flex items-center gap-1 transition-colors duration-200"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Reels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-cinema-dark rounded overflow-hidden border border-border">
              <Skeleton className="aspect-video w-full bg-cinema-grey" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-cinema-grey" />
                <Skeleton className="h-3 w-1/2 bg-cinema-grey" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredReels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReels.map((reel) => (
            <ReelCard key={reel.id.toString()} reel={reel} onClick={handleReelClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border rounded">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-xl font-bold text-muted-foreground mb-2">NO REELS FOUND</p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            {hasFilters ? 'Try adjusting your search or filters.' : 'No reels have been submitted yet.'}
          </p>
          {hasFilters ? (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-amber-glow/50 text-foreground hover:bg-amber-glow/10 font-display font-bold tracking-wider"
            >
              CLEAR FILTERS
            </Button>
          ) : null}
        </div>
      )}
    </main>
  );
}
