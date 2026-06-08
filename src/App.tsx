import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import { LandingPage } from "@/components/LandingPage"
import { DirectoryPageB } from "@/components/DirectoryPageB"
import { CleanerPage } from "@/components/CleanerPage"
import { NeighborhoodPage } from "@/components/NeighborhoodPage"
import { NotFound } from "@/components/NotFound"
import { posthog } from "@/lib/posthog"
import areasData from "@/data/areas.json"

type Theme = "a" | "b"

function resolveStoredTheme(): Theme | null {
  const param = new URLSearchParams(window.location.search).get("theme")
  if (param === "a" || param === "b") return param
  const stored = localStorage.getItem("vc_theme") as Theme | null
  if (stored === "a" || stored === "b") return stored
  return null
}

function AreaRoute({ theme, areaSlug: areaSlugProp }: { theme: Theme; areaSlug?: string }) {
  const { areaSlug: paramSlug } = useParams<{ areaSlug: string }>()
  const slug = areaSlugProp ?? paramSlug ?? "temecula-valley"
  const area = areasData.find((a) => a.id === slug)

  if (!area) return <NotFound />

  return theme === "b" ? <DirectoryPageB area={area} /> : <LandingPage area={area} />
}

export default function App() {
  const [theme, setTheme] = useState<Theme | null>(resolveStoredTheme)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("theme")
    if (param === "a" || param === "b") {
      posthog.register({ ab_theme: param })
      return
    }

    const stored = localStorage.getItem("vc_theme") as Theme | null
    if (stored === "a" || stored === "b") {
      posthog.register({ ab_theme: stored })
      return
    }

    // New user — let PostHog assign a variant and persist it
    posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag("directory-theme")
      const resolved: Theme = variant === "test" ? "b" : "a"
      setTheme(resolved)
      localStorage.setItem("vc_theme", resolved)
      posthog.register({ ab_theme: resolved })
    })
  }, [])

  if (theme === null) return null

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AreaRoute theme={theme} areaSlug="temecula-valley" />} />
          <Route path="/cleaners/:slug" element={<CleanerPage theme={theme} />} />
          <Route path="/neighborhoods/:slug" element={<NeighborhoodPage theme={theme} />} />
          <Route path="/:areaSlug" element={<AreaRoute theme={theme} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
