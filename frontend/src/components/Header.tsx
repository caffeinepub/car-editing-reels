import { Link } from '@tanstack/react-router';
import { ImageIcon, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export function Header() {
  const queryClient = useQueryClient();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-1 border-b border-border shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-sm group-hover:shadow-blue-glow transition-shadow duration-200">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              Thumbnail<span className="text-brand-blue">Uploader</span>
            </span>
          </Link>

          {/* Auth Button */}
          <Button
            size="sm"
            variant={isAuthenticated ? 'outline' : 'default'}
            onClick={handleAuth}
            disabled={isLoggingIn}
            className={
              isAuthenticated
                ? 'border-border text-ink-2 hover:text-foreground font-body font-medium'
                : 'bg-brand-blue hover:bg-brand-blue-light text-white font-body font-medium'
            }
          >
            {isLoggingIn ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
