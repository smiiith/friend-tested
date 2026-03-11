import posthog from "posthog-js"

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined

if (key) {
  posthog.init(key, {
    // Use VITE_POSTHOG_HOST for EU region: https://eu.i.posthog.com
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com",
    // Only create person profiles when identify() is called — better for privacy
    person_profiles: "identified_only",
    // Automatic pageview + click/form/input capture
    capture_pageview: true,
    autocapture: true,
  })
} else if (import.meta.env.DEV) {
  console.warn("[PostHog] VITE_POSTHOG_KEY is not set — tracking disabled.")
}

export { posthog }
