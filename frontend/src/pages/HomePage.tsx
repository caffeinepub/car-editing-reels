import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronRight, Play, Flame, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReelCard } from '../components/ReelCard';
import { useGetFeaturedReels } from '../hooks/useQueries';

export function HomePage() {
  const navigate = useNavigate();
  const { data: featuredReels, isLoading } = useGetFeaturedReels({ start: BigInt(0), end: BigInt(8) });

  const handleReelClick = (id: bigint) => {
    navigate({ to: '/reel/$id', params: { id: id.toString() } });
  };

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[560px] flex items-end overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        {/* Amber accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-glow to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-amber-glow" />
              <span className="text-xs font-display font-bold tracking-widest text-amber-glow uppercase">
                Car Editing Reels
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-black leading-none mb-4 text-foreground">
              FEEL THE{' '}
              <span className="text-gradient-amber">DRIVE</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-body font-light mb-8 max-w-lg leading-relaxed">
              Discover the most cinematic car editing reels from creators around the world. Pure automotive art, zero limits.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-widest shadow-glow-md hover:shadow-glow-lg transition-all duration-300 text-base px-8"
                >
                  <Play className="w-4 h-4 mr-2 fill-cinema-black" />
                  EXPLORE REELS
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-glow/50 text-foreground hover:bg-amber-glow/10 hover:border-amber-glow font-display font-bold tracking-widest text-base px-8 transition-all duration-300"
                >
                  SUBMIT YOURS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-cinema-dark border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10">
            {[
              { label: 'REELS SUBMITTED', value: featuredReels ? `${featuredReels.length}+` : '—' },
              { label: 'CREATORS', value: 'GLOBAL' },
              { label: 'GENRES', value: 'ALL STYLES' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="font-display text-xl font-black text-amber-glow">{stat.value}</span>
                <span className="text-xs font-display font-bold tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-amber-glow" />
            <h2 className="font-display text-3xl font-black tracking-wide text-foreground">
              FEATURED <span className="text-amber-glow">REELS</span>
            </h2>
          </div>
          <Link
            to="/browse"
            className="flex items-center gap-1 text-sm font-body font-semibold text-amber-glow hover:text-amber-bright transition-colors duration-200"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-cinema-dark rounded overflow-hidden border border-border">
                <Skeleton className="aspect-video w-full bg-cinema-grey" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-cinema-grey" />
                  <Skeleton className="h-3 w-1/2 bg-cinema-grey" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredReels && featuredReels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredReels.map((reel) => (
              <ReelCard key={reel.id.toString()} reel={reel} onClick={handleReelClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded">
            <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display text-xl font-bold text-muted-foreground mb-2">NO REELS YET</p>
            <p className="text-sm text-muted-foreground font-body mb-6">Be the first to submit a car editing reel.</p>
            <Link to="/upload">
              <Button className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-wider">
                SUBMIT FIRST REEL
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-cinema-dark border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-foreground">
            GOT A REEL TO <span className="text-gradient-amber">SHARE?</span>
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
            Submit your car editing reel and let the community experience your vision.
          </p>
          <Link to="/upload">
            <Button
              size="lg"
              className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-widest shadow-glow-md hover:shadow-glow-lg transition-all duration-300 px-10"
            >
              SUBMIT YOUR REEL
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

// Need Film import
import { Film } from 'lucide-react';
