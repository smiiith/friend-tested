# Vetted Local Cleaners (Friend Tested)

A multi-area local house cleaner directory — built for SEO, A/B testing, and easy expansion to new cities.

**Live site:** https://friendtested.pro

---

## What It Is

Vetted Local Cleaners is a directory of vetted local house cleaning and maid services across Southwest Riverside County. Users can browse cleaners by area, city, or neighborhood, view contact details, and click through to individual cleaner pages.

The site is data-driven: adding a new city requires only JSON updates — no code changes. It also runs an A/B test (Theme A vs Theme B) driven by PostHog feature flags to determine which layout drives more phone click conversions.

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS + CSS custom properties (theme tokens)
- **UI Components:** Radix UI (Dialog)
- **Analytics / A/B testing:** PostHog
- **Deployment:** Vercel
- **Data:** Static JSON files (`src/data/`) — intended to move to a database later

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx        # Theme A — area directory page (area-driven)
│   ├── DirectoryPageB.tsx     # Theme B — alternate layout (area-driven)
│   ├── CleanerPage.tsx        # Individual cleaner detail page (/cleaners/:slug)
│   ├── NeighborhoodPage.tsx   # Neighborhood landing pages (/neighborhoods/:slug)
│   └── NotFound.tsx           # 404 page (shown for unknown area slugs)
│   └── ui/
│       ├── button.tsx
│       └── dialog.tsx
├── data/
│   ├── areas.json             # Area definitions (slug, cities, hero, SEO copy)
│   ├── cleaners.json          # All cleaner listings (city field maps to areas)
│   └── neighborhoods.json     # Neighborhood pages data
├── lib/
│   ├── posthog.ts             # PostHog initialization
│   ├── seo.ts                 # Utility: sets title, meta, canonical, OG, JSON-LD
│   └── utils.ts
├── App.tsx                    # Routing + A/B theme assignment + AreaRoute
└── index.css                  # Theme tokens (Theme A + Theme B CSS variables)

public/
├── logos/                     # Brand logo variants (black, blue, dark-blue, light-blue)
├── hero/                      # Hero images (per area)
├── sitemap.xml                # All URLs including area, cleaner, and neighborhood pages
└── robots.txt                 # Allows all; X-Robots-Tag noindex on Vercel previews
```

---

## Pages & Routing

| Route                  | Component                         | Description                              |
| ---------------------- | --------------------------------- | ---------------------------------------- |
| `/`                    | `LandingPage` or `DirectoryPageB` | Defaults to temecula-valley area         |
| `/:areaSlug`           | `LandingPage` or `DirectoryPageB` | Any supported area (e.g. `/menifee`)     |
| `/cleaners/:slug`      | `CleanerPage`                     | Individual cleaner detail page           |
| `/neighborhoods/:slug` | `NeighborhoodPage`                | Neighborhood landing page                |

Unknown area slugs (e.g. `/cucamonga`) render the `NotFound` 404 page. The `/temecula-valley` path is valid and shows the same content as `/`.

---

## A/B Test

The A/B test is driven by a PostHog feature flag (`directory-theme`). Theme assignment persists in `localStorage` so returning users always see the same variant.

**Priority order for theme resolution:**

1. URL param `?theme=a` or `?theme=b` — for QA/testing only
2. `localStorage` — returning users keep their assigned variant
3. PostHog feature flag — new users get assigned a variant

**Theme A (Trust Blue):**

- White background, blue primary, green accent
- Full-width hero image banner (per-area)
- Sticky nav with dark-blue logo and area location badge
- One section per city in the area, alternating tinted bands
- "Contact" toggle reveals phone + Book Online

**Theme B (Warm Earth):**

- Warm cream background, terracotta primary, gold accent
- Centered header with black logo
- City filter tabs generated dynamically from the area's cities
- 2-column card grid with contact always visible

**Setting up the PostHog flag:**

1. Go to PostHog → Feature Flags → New
2. Key: `directory-theme`
3. Type: Multiple variants — `control` (50%), `test` (50%)
4. Roll out to 100% of users

**Local testing:** Visit `/?theme=b` to force Theme B without needing PostHog configured.

---

## Data

### Adding a new area (`src/data/areas.json`)

```json
{
  "id": "lake-elsinore",
  "name": "Lake Elsinore",
  "displayName": "Lake Elsinore",
  "canonical": "https://friendtested.pro/lake-elsinore",
  "cities": ["Lake Elsinore"],
  "heroImage": "/hero/lake-elsinore-1.jpg",
  "heroAlt": "Lake Elsinore, CA",
  "heroTagline": "Lake Elsinore, CA.",
  "seo": {
    "title": "Vetted Local Cleaners | House Cleaners in Lake Elsinore, CA",
    "description": "Find local house cleaners and maid services in Lake Elsinore, CA."
  },
  "seoSection": {
    "heading": "Finding a Reliable Maid Service in Lake Elsinore",
    "body": "..."
  }
}
```

- `id` becomes the URL slug (`/lake-elsinore`)
- `cities` is a list of city strings — cleaners and neighborhoods are matched by this array
- For multi-city areas (like temecula-valley), list all cities: `["Murrieta", "Temecula"]`
- Add the area URL to `public/sitemap.xml`

### Adding a cleaner (`src/data/cleaners.json`)

```json
{
  "id": "unique-slug",
  "name": "Business Name",
  "phone": "(951) 555-0000",
  "address": "123 Main St, Menifee, CA 92584",
  "city": "Menifee",
  "serviceArea": ["Menifee", "Murrieta"],
  "description": "2-3 sentence description with local flavor and keywords.",
  "services": ["Regular Cleaning", "Deep Cleaning", "Move-In/Move-Out Cleaning"]
}
```

- `city` must match a string in one of the areas' `cities` arrays — this is how the cleaner gets assigned to an area page
- Add their URL to `public/sitemap.xml`
- JSON-LD for area pages is generated dynamically — no need to update `index.html`

### Adding a neighborhood (`src/data/neighborhoods.json`)

```json
{
  "id": "neighborhood-slug",
  "name": "Neighborhood Name",
  "city": "Menifee",
  "matchCity": "Menifee",
  "tagline": "One-line description",
  "paragraphs": [
    "Paragraph 1 — local history/character.",
    "Paragraph 2 — housing types and resident profile.",
    "Paragraph 3 — call to action with cleaning service keywords."
  ]
}
```

Cleaners are matched to neighborhoods using `matchCity` — any cleaner whose `serviceArea` includes `matchCity` will appear on that neighborhood page. After adding a neighborhood, add its URL to `public/sitemap.xml`.

---

## SEO

### Technical

- Unique `<title>`, `<meta description>`, canonical, and Open Graph tags on every page (managed via `src/lib/seo.ts`)
- JSON-LD structured data injected dynamically per page:
  - Area pages: `WebPage` + `ItemList` of `HomeAndConstructionBusiness` entries
  - Cleaner pages: `LocalBusiness` + `BreadcrumbList`
  - Neighborhood pages: `BreadcrumbList` + `ItemList`
- Static fallback `WebSite` + `LocalBusiness` schema in `index.html` for non-JS crawlers
- Sitemap covers all area, cleaner, and neighborhood pages
- `X-Robots-Tag: noindex, nofollow` on all `*.vercel.app` preview deployments (via `vercel.json`)

### Current areas

| Area slug         | Cities                   | URL                                    |
| ----------------- | ------------------------ | -------------------------------------- |
| `temecula-valley` | Murrieta, Temecula       | `/` and `/temecula-valley`             |
| `menifee`         | Menifee                  | `/menifee`                             |

### Keywords targeted

- Area-level: "house cleaner Menifee CA", "maid service Murrieta", "house cleaners Temecula Valley"
- Neighborhood-level: "house cleaners Redhawk", "cleaning service California Oaks Murrieta"
- Service-level: "deep cleaning Temecula", "move-out cleaning Menifee"
- Trust-framing: "vetted house cleaners", "neighbor-recommended cleaning"

---

## Analytics (PostHog)

**Events tracked:**

- `phone_number_clicked` — fired on every phone number click, with properties:
  - `cleaner_id`, `cleaner_name`, `cleaner_city`
  - `page` — `"directory"`, `"cleaner_detail"`, or `"neighborhood"`
  - `area` — area slug (directory pages only)
  - `neighborhood` — (neighborhood pages only)
- `contact_clicked` — fired when the Contact toggle is expanded (Theme A only)
- `book_online_clicked` — fired when Book Online is clicked
- `ab_theme` — super property registered on every event, value is `"a"` or `"b"`

---

## Environment Variables

| Variable            | Description                                        |
| ------------------- | -------------------------------------------------- |
| `VITE_POSTHOG_KEY`  | PostHog project API key                            |
| `VITE_POSTHOG_HOST` | PostHog host (default: `https://us.i.posthog.com`) |

Create a `.env.local` file for local development:

```
VITE_POSTHOG_KEY=phc_your_key_here
```

---

## Development

```bash
npm install
npm run dev        # localhost:5173
npm run build      # production build
npm run lint
```

---

## Deployment

Deployed on Vercel. Push to `main` to deploy. Preview deployments are automatically blocked from search indexing via the `X-Robots-Tag` header in `vercel.json`.
