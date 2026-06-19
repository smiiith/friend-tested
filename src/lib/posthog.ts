import posthog from "posthog-js"

// Initialize at module scope so PostHog is ready before any React effects run.
// The typeof window guard prevents this from executing during SSR.
if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (key) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest",
      person_profiles: "identified_only",
      capture_pageview: true,
      autocapture: true,
    })
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set — tracking disabled.")
  }
}

export { posthog }
