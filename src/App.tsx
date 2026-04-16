import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/components/LandingPage"
import { DirectoryPageB } from "@/components/DirectoryPageB"
import { CleanerPage } from "@/components/CleanerPage"
import { NeighborhoodPage } from "@/components/NeighborhoodPage"
import { posthog } from "@/lib/posthog"

type Theme = "a" | "b"

export default function App() {
  const [theme, setTheme] = useState<Theme>("a")

  useEffect(() => {
    // 1. URL param takes priority — useful for local testing (?theme=a or ?theme=b)
    const param = new URLSearchParams(window.location.search).get("theme")
    if (param === "a" || param === "b") {
      setTheme(param)
      posthog.register({ ab_theme: param })
      return
    }

    // 2. Returning user — use their previously assigned theme
    const stored = localStorage.getItem("vc_theme") as Theme | null
    if (stored === "a" || stored === "b") {
      setTheme(stored)
      posthog.register({ ab_theme: stored })
      return
    }

    // 3. New user — let PostHog assign a variant and persist it
    posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag("directory-theme")
      const resolved: Theme = variant === "test" ? "b" : "a"
      setTheme(resolved)
      localStorage.setItem("vc_theme", resolved)
      posthog.register({ ab_theme: resolved })
    })
  }, [])

  const HomePage = theme === "b" ? DirectoryPageB : LandingPage

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cleaners/:slug" element={<CleanerPage theme={theme} />} />
          <Route path="/neighborhoods/:slug" element={<NeighborhoodPage theme={theme} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
