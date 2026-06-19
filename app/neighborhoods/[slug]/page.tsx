import type { Metadata } from "next"
import { notFound } from "next/navigation"
import neighborhoodsData from "@/data/neighborhoods.json"
import cleanersData from "@/data/cleaners.json"
import { NeighborhoodPage } from "@/components/NeighborhoodPage"

export function generateStaticParams() {
  return neighborhoodsData.map((n) => ({ slug: n.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const neighborhood = neighborhoodsData.find((n) => n.id === slug)
  if (!neighborhood) return {}

  const pageUrl = `https://friendtested.pro/neighborhoods/${neighborhood.id}`
  const title = `House Cleaners in ${neighborhood.name}, ${neighborhood.city} CA`
  const description = `Find trusted house cleaners and maid services in ${neighborhood.name}, ${neighborhood.city}, CA. Browse local cleaning services serving ${neighborhood.name} and surrounding ${neighborhood.city} communities.`

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: { title, description, url: pageUrl },
    twitter: { title, description },
  }
}

export default async function NeighborhoodSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const neighborhood = neighborhoodsData.find((n) => n.id === slug)
  if (!neighborhood) notFound()

  const pageUrl = `https://friendtested.pro/neighborhoods/${neighborhood.id}`
  const cleaners = cleanersData.filter((c) =>
    c.serviceArea.includes(neighborhood.matchCity),
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://friendtested.pro/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `House Cleaners in ${neighborhood.city}`,
            item: "https://friendtested.pro/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${neighborhood.name}, ${neighborhood.city}`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `House Cleaners serving ${neighborhood.name}, ${neighborhood.city} CA`,
        url: pageUrl,
        itemListElement: cleaners.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: `https://friendtested.pro/cleaners/${c.id}`,
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
      <NeighborhoodPage neighborhood={neighborhood} />
    </>
  )
}
