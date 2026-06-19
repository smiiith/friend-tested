"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { posthog } from "@/lib/posthog"

type Theme = "a" | "b"

const ThemeContext = createContext<Theme>("a")

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to "a" so SSR and initial client render match (no hydration mismatch).
  // The inline script in layout.tsx handles the CSS theme for returning theme B users
  // before React hydrates, so there's no visual flash for CSS variables.
  const [theme, setTheme] = useState<Theme>("a")

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get(
      "theme",
    ) as Theme | null
    if (param === "a" || param === "b") {
      document.documentElement.setAttribute("data-theme", param)
      posthog.register({ ab_theme: param })
      setTheme(param)
      return
    }

    const stored = localStorage.getItem("vc_theme") as Theme | null
    if (stored === "a" || stored === "b") {
      document.documentElement.setAttribute("data-theme", stored)
      posthog.register({ ab_theme: stored })
      setTheme(stored)
      return
    }

    // New user — let PostHog assign a variant
    posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag("directory-theme")
      const resolved: Theme = variant === "test" ? "b" : "a"
      document.documentElement.setAttribute("data-theme", resolved)
      localStorage.setItem("vc_theme", resolved)
      posthog.register({ ab_theme: resolved })
      setTheme(resolved)
    })
  }, [])

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): Theme {
  return useContext(ThemeContext)
}
