# DriveSight SEO Architecture

Production-grade programmatic SEO for thousands of indexable pages without thin duplicate templates.

## URL structure

| Pattern | Example | Pages |
|--------|---------|-------|
| Test type hub | `/dmv/{state}/{testType}` | 50 × 6 = **300** |
| Category hub | `/dmv/{state}/category/{category}` | 50 × 10 = **500** |
| Guides index | `/guides` | 1 |
| Road signs app | `/road-signs` | 1 (public) |

### Test types (`lib/seo/taxonomy.ts`)

- `dmv-practice-test`
- `road-signs-test`
- `hard-questions`
- `motorcycle-permit-test`
- `cdl-permit-test`
- `spanish-permit-test`

### Categories

- `road-signs`, `right-of-way`, `traffic-signals`, `parking`, `speed-limits`
- `school-zones`, `emergency-vehicles`, `alcohol-dui`, `defensive-driving`, `lane-changes`

### App routes (noindex)

- `/states/{code}` — authenticated practice UI
- `/login`, `/auth/*`

## Folder structure

```text
lib/seo/
  config.ts          # Site name, base URL
  types.ts           # Shared TS types
  taxonomy.ts        # States, test types, categories, static params
  urls.ts            # Canonical path builders
  content.ts         # Dynamic copy (intro, FAQs, tips) per page
  metadata.ts        # Next.js Metadata generator
  schema.ts          # JSON-LD (WebPage, FAQPage, BreadcrumbList, LearningResource)
  sitemap-entries.ts # Sitemap generator
  index.ts

components/seo/
  JsonLd.tsx
  Breadcrumbs.tsx
  FaqSection.tsx
  RelatedLinks.tsx
  SeoPageTemplate.tsx

app/dmv/[stateSlug]/[testType]/page.tsx
app/dmv/[stateSlug]/category/[categorySlug]/page.tsx
app/guides/page.tsx
app/sitemap.ts
app/robots.ts
```

## Metadata

Every SEO page uses `buildPageMetadata()`:

- Unique `title` + `description`
- `keywords` array
- Canonical URL via `alternates.canonical`
- OpenGraph + Twitter cards
- `robots: index, follow` (app pages use `buildAppPageMetadata` → noindex)

Set production URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Structured data

`SeoPageTemplate` injects JSON-LD graph:

1. `WebPage`
2. `BreadcrumbList`
3. `FAQPage`
4. `LearningResource`

## Internal linking

- Breadcrumbs: Home → Guides → State → Current page
- Related links: other test types + category entry
- State app pages link to public SEO guide
- Guides hub links to top states + all states grid

## Legacy redirects

Old URLs like `/dmv/california-dmv-practice-test` redirect (301) to `/dmv/california/dmv-practice-test` via `next.config.ts`.

## Sitemap scale

~**804** URLs in sitemap (300 test + 500 category + core).

Run `npm run build` to statically generate all SEO pages.

## Content quality rules

`lib/seo/content.ts` uses:

- State-specific tips for CA, TX, FL, NY
- Passing score disclaimers per state
- Unique FAQs per test type
- No duplicate titles across test type + category combos

**Next step for scale:** feed real state-specific question copy from Supabase into SEO sections (question counts, category availability).

## Impact-ordered recommendations

1. Set `NEXT_PUBLIC_SITE_URL` on Vercel
2. Submit `sitemap.xml` in Google Search Console + Bing
3. Load 100+ questions for top 10 states (content depth)
4. Add `hreflang` only if you ship true Spanish UI
5. Add `Article` schema once you publish blog posts
6. Monitor GSC for soft-404 / duplicate meta
7. Add OG images per state (optional `opengraph-image.tsx`)

## Core Web Vitals

- Static generation (SSG) for SEO routes
- No extra client JS on SEO templates
- Semantic HTML: `article`, `section`, `nav`, `dl` for FAQs
- Public pages skip auth middleware overhead
