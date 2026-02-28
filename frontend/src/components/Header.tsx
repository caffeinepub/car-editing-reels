import { Link, useLocation } from '@tanstack/react-router';
import { Film, Upload, Grid3X3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/upload', label: 'Submit Reel' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-cinema-black/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-amber-glow flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
              <Film className="w-4 h-4 text-cinema-black" />
            </div>
            <span className="font-display text-xl font-black tracking-widest text-foreground">
              REV<span className="text-amber-glow">REEL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-body font-semibold tracking-wide transition-colors duration-200 rounded ${
                  isActive(link.to)
                    ? 'text-amber-glow bg-amber-glow/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-cinema-grey'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/upload">
              <Button
                size="sm"
                className="bg-amber-glow text-cinema-black hover:bg-amber-bright font-display font-bold tracking-wider shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                SUBMIT
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-cinema-dark">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-body font-semibold rounded transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-amber-glow bg-amber-glow/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-cinema-grey'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
