import type { Metadata } from "next"
import { notFound } from "next/navigation"
import areasData from "@/data/areas.json"
import cleanersData from "@/data/cleaners.json"
import { AreaPage } from "@/components/AreaPage"

export function generateStaticParams() {
  return areasData
    .filter((a) => a.id !== "temecula-valley")
    .map((a) => ({ areaSlug: a.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ areaSlug: string }>
}): Promise<Metadata> {
  const { areaSlug } = await params
  const area = areasData.find((a) => a.id === areaSlug)
  if (!area) return {}
  return {
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
}

export default async function AreaSlugPage({
  params,
}: {
  params: Promise<{ areaSlug: string }>
}) {
  const { areaSlug } = await params
  const area = areasData.find((a) => a.id === areaSlug)
  if (!area) notFound()

  const areaCleaners = cleanersData.filter((c) =>
    (area.cities as string[]).includes(c.city),
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
