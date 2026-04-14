# Friend Tested Cleaners

A local house cleaner directory serving Murrieta and Temecula, CA — built for SEO and A/B testing.

**Live site:** https://friendtested.pro

---

## What It Is

Friend Tested Cleaners is a directory of vetted local house cleaning and maid services in the Temecula Valley. Users can browse cleaners by city or neighborhood, view contact details, and click to individual cleaner pages.

The site runs an A/B test (Theme A vs Theme B) driven by PostHog feature flags to determine which layout and visual design drives more phone click conversions.

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS + CSS custom properties (theme tokens)
- **UI Components:** Radix UI (Dialog)
- **Analytics / A/B testing:** PostHog
- **Deployment:** Vercel
- **Data:** Static JSON files (`src/data/`)

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx        # Theme A — directory home page
│   ├── DirectoryPageB.tsx     # Theme B — alternate directory layout
│   ├── CleanerPage.tsx        # Individual cleaner detail page (/cleaners/:slug)
│   ├── NeighborhoodPage.tsx   # Neighborhood landing pages (/neighborhoods/:slug)
│   └── ui/
│       ├── button.tsx
│       └── dialog.tsx
├── data/
│   ├── cleaners.json          # All cleaner listings
│   └── neighborhoods.json     # Neighborhood pages data
├── lib/
│   ├── posthog.ts             # PostHog initialization
│   └── utils.ts
├── App.tsx                    # Routing + A/B theme assignment
└── index.css                  # Theme tokens (Theme A + Theme B CSS variables)

public/
├── logos/                     # Brand logo variants (black, blue, dark-blue, light-blue)
├── hero/                      # Hero images
├── sitemap.xml                # All URLs including cleaner + neighborhood pages
└── robots.txt                 # Allows all; X-Robots-Tag noindex on Vercel previews
```

---

## Pages

| Route                  | Component                         | Description                    |
| ---------------------- | --------------------------------- | ------------------------------ |
| `/`                    | `LandingPage` or `DirectoryPageB` | Directory home (A/B tested)    |
| `/cleaners/:slug`      | `CleanerPage`                     | Individual cleaner detail page |
| `/neighborhoods/:slug` | `NeighborhoodPage`                | Neighborhood landing page      |

---

## A/B Test

The A/B test is driven by a PostHog feature flag (`directory-theme`). Theme assignment persists in `localStorage` so returning users always see the same variant.

**Priority order for theme resolution:**

1. URL param `?theme=a` or `?theme=b` — for QA/testing only
2. `localStorage` — returning users keep their assigned variant
3. PostHog feature flag — new users get assigned a variant

**Theme A (Trust Blue):**

- White background, blue primary, green accent
- Full-width hero image banner
- Sticky nav with dark-blue logo
- Two sections (Murrieta / Temecula) with list cards
- "More" toggle reveals phone + Book Online

**Theme B (Warm Earth):**

- Warm cream background, terracotta primary, gold accent
- Centered header with black logo
- City filter tabs (All / Murrieta / Temecula)
- 2-column card grid with contact always visible

**Setting up the PostHog flag:**

1. Go to PostHog → Feature Flags → New
2. Key: `directory-theme`
3. Type: Multiple variants — `a` (50%), `b` (50%)
4. Roll out to 100% of users

**Local testing:** Visit `/?theme=b` to force Theme B without needing PostHog configured.

---

## Data

### Adding a cleaner (`src/data/cleaners.json`)

```json
{
  "id": "unique-slug",
  "name": "Business Name",
  "phone": "(951) 555-0000",
  "address": "123 Main St, Murrieta, CA 92562",
  "city": "Murrieta",
  "serviceArea": ["Murrieta", "Temecula"],
  "description": "2-3 sentence description with local flavor and keywords.",
  "services": ["Regular Cleaning", "Deep Cleaning", "Move-In/Move-Out Cleaning"]
}
```

After adding a cleaner:

- Add their URL to `public/sitemap.xml`
- Add them to the `ItemList` in `index.html` JSON-LD

### Adding a neighborhood (`src/data/neighborhoods.json`)

```json
{
  "id": "neighborhood-slug",
  "name": "Neighborhood Name",
  "city": "Temecula",
  "matchCity": "Temecula",
  "tagline": "One-line description",
  "paragraphs": [
    "Paragraph 1 — local history/character.",
    "Paragraph 2 — housing types and resident profile.",
    "Paragraph 3 — call to action with cleaning service keywords."
  ]
}
```

Cleaners are matched to neighborhoods using `matchCity` — any cleaner whose `serviceArea` includes `matchCity` will appear on that neighborhood page.

After adding a neighborhood:

- Add its URL to `public/sitemap.xml`

---

## SEO

### Technical

- Unique `<title>` and `<meta description>` on every page (set via `useEffect`)
- `<link rel="canonical">` injected per page
- Open Graph + Twitter Card tags on all pages
- JSON-LD structured data:
  - Homepage: `WebSite` + `LocalBusiness` + `ItemList` (directory)
  - Cleaner pages: `LocalBusiness` + `BreadcrumbList`
  - Neighborhood pages: `BreadcrumbList` + `ItemList`
- Sitemap covers all 16 pages (1 home + 10 cleaners + 5 neighborhoods)
- `X-Robots-Tag: noindex, nofollow` on all `*.vercel.app` preview deployments (via `vercel.json`)

### Keywords targeted

- City-level: "house cleaner Murrieta", "maid service Temecula CA"
- Neighborhood-level: "house cleaners Redhawk", "cleaning service California Oaks Murrieta"
- Service-level: "deep cleaning Temecula", "move-out cleaning Murrieta"
- Trust-framing: "vetted house cleaners", "neighbor-recommended cleaning"

See [GitHub issue #8](https://github.com/smiiith/friend-tested/issues/8) for the full 50-keyword analysis with intent and buying stage breakdown.

---

## Analytics (PostHog)

**Events tracked:**

- `phone_number_clicked` — fired on every phone number click, with properties:
  - `cleaner_id`, `cleaner_name`, `cleaner_city`
  - `page` — `"directory"`, `"cleaner_detail"`, or `"neighborhood"`
  - `neighborhood` — (neighborhood pages only)
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
