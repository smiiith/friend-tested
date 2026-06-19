"use client"

// Importing posthog.ts here ensures it's included in the client bundle and
// posthog.init() runs at module scope before any React effects.
import "@/lib/posthog"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
