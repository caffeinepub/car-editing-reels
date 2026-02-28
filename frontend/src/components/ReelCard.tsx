import { Eye, Play } from 'lucide-react';
import type { Reel } from '../backend';

interface ReelCardProps {
  reel: Reel;
  onClick: (id: bigint) => void;
}

export function ReelCard({ reel, onClick }: ReelCardProps) {
  const thumbnailSrc = reel.thumbnailUrl || '/assets/generated/reel-placeholder-thumb.dim_640x360.png';

  return (
    <article
      className="group relative bg-cinema-dark rounded overflow-hidden cursor-pointer card-hover-glow border border-border"
      onClick={() => onClick(reel.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(reel.id)}
      aria-label={`Watch ${reel.title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-cinema-grey">
        <img
          src={thumbnailSrc}
          alt={reel.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/reel-placeholder-thumb.dim_640x360.png';
          }}
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cinema-black/40">
          <div className="w-14 h-14 rounded-full bg-amber-glow/90 flex items-center justify-center shadow-glow-md">
            <Play className="w-6 h-6 text-cinema-black fill-cinema-black ml-1" />
          </div>
        </div>
        {/* Amber edge accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-glow to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display text-base font-bold text-foreground leading-tight line-clamp-2 mb-1 group-hover:text-amber-glow transition-colors duration-200">
          {reel.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 truncate font-body">
          {reel.uploader || 'Anonymous'}
        </p>

        {/* Tags */}
        {reel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {reel.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded-sm bg-cinema-grey text-amber-glow border border-amber-glow/20 font-body"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* View count */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          <span>{Number(reel.viewCount).toLocaleString()} views</span>
        </div>
      </div>
    </article>
  );
}
