# SEO Architecture

## Overview
This portfolio is a Vite React SPA designed as a strong branded landing page. The SEO approach focuses on technical correctness, semantic identity, and crawl-ready metadata without altering the creative design or removing the animations.

## Metadata System
The project uses a centralized SEO config at src/seo/config.ts to define:
- site name
- canonical URL
- default title
- meta description
- locale
- OG image path
- social profile list

The app also injects critical metadata on mount to keep the site identity explicit for crawlers and social platforms.

## Sitemap
Static sitemap is available at:
- /sitemap.xml

The current sitemap includes the canonical homepage URL because the portfolio is structured as a single-page experience.

## Robots
Static robots rules are available at:
- /robots.txt

The file allows full crawling of the site and points to the sitemap.

## Canonical Strategy
The canonical URL is set to:
- https://dibrab.vercel.app/

This prevents duplicate URL confusion and ensures the main homepage is the preferred indexable URL.

## Structured Data
The app injects JSON-LD schema for:
- WebSite
- Person

This helps search engines understand the portfolio identity and website purpose without inventing unsupported professional claims.

## Project SEO
The existing project archive is GitHub-based and rendered dynamically. The current portfolio remains a single-page landing page, so project information is surfaced through the section and card UI rather than dedicated per-project routes. This is the most appropriate pattern for the current architecture.

## Image SEO
The site includes custom local images and social assets. The generated OG image and icon are designed for social preview and PWA identity. Alt text is defined for key visual elements, and decorative visuals are marked appropriately.

## Internal Linking
The portfolio uses anchor-based navigation for:
- Home
- About
- Skills
- Projects
- Contact

This supports crawlability and user navigation while preserving the single-page experience.

## Google Search Console and Bing Webmaster Tools
The project includes documentation files for both platforms to help with verification and sitemap submission.

## Deployment
The project includes Vercel configuration and checks for static SEO files. The files are intended to be served at their root paths.

## Future SEO Workflow
Recommended future workflow:
1. Keep metadata and identity updated in the central SEO config.
2. Add specific public pages only when genuinely useful.
3. Refresh schema if the portfolio adds a custom domain or additional professional identity signals.
4. Monitor Search Console and Bing Webmaster Tools for indexing trends.
