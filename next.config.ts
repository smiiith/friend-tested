import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  async redirects() {
    return [
      // temecula-valley was accessible via /:areaSlug in the Vite SPA.
      // The canonical URL is / — redirect the old path permanently.
      {
        source: "/temecula-valley",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
