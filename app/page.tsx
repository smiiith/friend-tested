import type { Metadata } from "next"
import areasData from "@/data/areas.json"
import cleanersData from "@/data/cleaners.json"
import { AreaPage } from "@/components/AreaPage"

const area = areasData.find((a) => a.id === "temecula-valley")!
const areaCleaners = cleanersData.filter((c) =>
  (area.cities as string[]).includes(c.city),
)

export const metadata: Metadata = {
  title: area.seo.title,
  description: area.seo.description,
  alternates: { canonical: area.canonical },
  openGraph: {
    title: area.seo.title,
    description: area.seo.description,
    url: area.canonical,
  },
  twitter: {
    title: area.seo.title,
    description: area.seo.description,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://friendtested.pro/#website",
      url: "https://friendtested.pro",
      name: "Friend Tested Cleaners",
      description:
        "A community-curated directory of trusted local house cleaners and maid services in Southwest Riverside County, CA.",
    },
    {
      "@type": "WebPage",
      "@id": area.canonical,
      url: area.canonical,
      name: `House Cleaners in ${area.displayName}, CA`,
      description: area.seo.description,
      isPartOf: { "@id": "https://friendtested.pro/#website" },
    },
    {
      "@type": "ItemList",
      name: `House Cleaners in ${area.displayName}, CA`,
      description: area.seo.description,
      url: area.canonical,
      itemListElement: areaCleaners.map((cleaner, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "HomeAndConstructionBusiness",
          "@id": `https://friendtested.pro/cleaners/${cleaner.id}`,
          name: cleaner.name,
          telephone: cleaner.phone,
          address: cleaner.address,
          url: `https://friendtested.pro/cleaners/${cleaner.id}`,
          areaServed: cleaner.serviceArea.map((city) => ({
            "@type": "City",
            name: city,
          })),
        },
      })),
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AreaPage area={area} />
    </>
  )
}
