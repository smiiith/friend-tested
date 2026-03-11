import { useState, useEffect } from "react"
import { LandingPage } from "@/components/LandingPage"
import { posthog } from "@/lib/posthog"

type Theme = "a" | "b"

function getInitialTheme(): Theme {
  // 1. Check URL param (useful for A/B links and dev testing)
  const params = new URLSearchParams(window.location.search)
  const paramTheme = params.get("theme")
  if (paramTheme === "a" || paramTheme === "b") return paramTheme

  // 2. Check session storage (keep consistent within a session)
  const stored = sessionStorage.getItem("vc_theme") as Theme | null
  if (stored === "a" || stored === "b") return stored

  // 3. Random 50/50 assignment
  const assigned: Theme = Math.random() < 0.5 ? "a" : "b"
  sessionStorage.setItem("vc_theme", assigned)
  return assigned
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Persist theme + register as PostHog super property so every event carries ab_theme
  useEffect(() => {
    sessionStorage.setItem("vc_theme", theme)
    posthog.register({ ab_theme: theme })
    // Update URL param without page reload (useful for sharing dev links)
    const url = new URL(window.location.href)
    url.searchParams.set("theme", theme)
    window.history.replaceState({}, "", url.toString())
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === "a" ? "b" : "a"))
  }

  return (
    <div data-theme={theme}>
      <LandingPage
        theme={theme}
        onToggleTheme={toggleTheme}
        isDev={import.meta.env.DEV}
      />
    </div>
  )
}
