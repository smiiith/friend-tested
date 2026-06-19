import type { MetadataRoute } from "next"
import areasData from "@/data/areas.json"
import cleanersData from "@/data/cleaners.json"
import neighborhoodsData from "@/data/neighborhoods.json"

const BASE_URL = "https://friendtested.pro"

export default function sitemap(): MetadataRoute.Sitemap {
  const areaPages: MetadataRoute.Sitemap = areasData.map((area) => ({
    url: area.canonical,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: area.id === "temecula-valley" ? 1.0 : 0.9,
  }))

  const cleanerPages: MetadataRoute.Sitemap = cleanersData.map((cleaner) => ({
    url: `${BASE_URL}/cleaners/${cleaner.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoodsData.map(
    (n) => ({
      url: `${BASE_URL}/neighborhoods/${n.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  )

  return [...areaPages, ...cleanerPages, ...neighborhoodPages]
}
