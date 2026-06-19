"use client"

import { useTheme } from "@/components/ThemeProvider"
import { LandingPage } from "@/components/LandingPage"
import { DirectoryPageB } from "@/components/DirectoryPageB"
import type areasData from "@/data/areas.json"

type Area = (typeof areasData)[0]

export function AreaPage({ area }: { area: Area }) {
  const theme = useTheme()
  return theme === "b" ? (
    <DirectoryPageB area={area} />
  ) : (
    <LandingPage area={area} />
  )
}
