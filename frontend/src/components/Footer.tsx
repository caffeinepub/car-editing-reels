import { Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'thumbnail-uploader'
  );

  return (
    <footer className="bg-surface-1 border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-3 font-body">
            © {year} Thumbnail Uploader. All rights reserved.
          </p>
          <p className="text-xs text-ink-3 font-body flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-brand-blue fill-brand-blue" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
