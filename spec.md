# Specification

## Summary
**Goal:** Build RevReel, a car editing reels showcase website with a dark cinematic theme where users can browse, submit, and watch car editing videos.

**Planned changes:**
- Homepage with a full-width hero banner (using `hero-banner.dim_1920x600.png`), featured reel cards grid (thumbnail, title, uploader, view count), and a CTA to the browse page
- Browse/gallery page with responsive reel grid, tag/category filter buttons, and a search input filtering by title or description
- Reel submission form page with fields for title, description, video URL (YouTube/Vimeo), thumbnail URL, and tags; form validation and success confirmation
- Reel detail/playback page with embedded video player, full metadata display (title, description, uploader, tags, view count), and view count increment on each visit
- Backend (Motoko) storing reel submissions and handling view count increments
- Dark cinematic visual theme: deep black/dark-grey backgrounds, amber/orange accents, bold sans-serif typography, edge-lit glowing card borders applied consistently across all pages

**User-visible outcome:** Users can visit the site to browse a gallery of car editing reels, search and filter by tags, submit their own reels via a form, and watch individual reels on a dedicated playback page — all within a high-energy dark automotive visual style.
