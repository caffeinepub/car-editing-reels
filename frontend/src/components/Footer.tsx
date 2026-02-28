import { Film, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'revreel');

  return (
    <footer className="bg-cinema-black border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-amber-glow flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-cinema-black" />
              </div>
              <span className="font-display text-lg font-black tracking-widest">
                REV<span className="text-amber-glow">REEL</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              The ultimate destination for car editing reels. Discover, share, and celebrate automotive cinematography.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-widest text-amber-glow mb-3">NAVIGATE</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/browse', label: 'Browse Reels' },
                { to: '/upload', label: 'Submit a Reel' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-amber-glow transition-colors duration-200 font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-widest text-amber-glow mb-3">THE CULTURE</h4>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Built for creators who live for the rev, the roar, and the perfect edit.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body">
            © {year} RevReel. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-amber-glow fill-amber-glow" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-glow hover:text-amber-bright transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
