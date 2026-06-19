import type { Metadata } from "next"
import { notFound } from "next/navigation"
import cleanersData from "@/data/cleaners.json"
import areasData from "@/data/areas.json"
import { CleanerPage } from "@/components/CleanerPage"

export function generateStaticParams() {
  return cleanersData.map((c) => ({ slug: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cleaner = cleanersData.find((c) => c.id === slug)
  if (!cleaner) return {}

  const raw = cleaner.description
  let metaDesc = raw.slice(0, 155)
  const lastPeriod = metaDesc.lastIndexOf(".")
  if (lastPeriod > 80) metaDesc = metaDesc.slice(0, lastPeriod + 1)

  const pageUrl = `https://friendtested.pro/cleaners/${cleaner.id}`
  const title = `${cleaner.name} | House Cleaning in ${cleaner.city}, CA`

  return {
    title,
    description: metaDesc,
    alternates: { canonical: pageUrl },
    openGraph: { title, description: metaDesc, url: pageUrl },
    twitter: { title, description: metaDesc },
  }
}

export default async function CleanerSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cleaner = cleanersData.find((c) => c.id === slug)
  if (!cleaner) notFound()

  const pageUrl = `https://friendtested.pro/cleaners/${cleaner.id}`
  const area = areasData.find((a) =>
    (a.cities as string[]).includes(cleaner.city),
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": pageUrl,
        name: cleaner.name,
        description: cleaner.description,
        telephone: cleaner.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: cleaner.address,
          addressLocality: cleaner.city,
          addressRegion: "CA",
          addressCountry: "US",
        },
        areaServed: cleaner.serviceArea.map((a) => ({
          "@type": "City",
          name: a,
        })),
        url: pageUrl,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Cleaning Services",
          itemListElement: cleaner.services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        },
      },
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
            name: `House Cleaners in ${cleaner.city}`,
            item: area?.canonical ?? "https://friendtested.pro/",
          },
          { "@type": "ListItem", position: 3, name: cleaner.name, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CleanerPage cleaner={cleaner} />
    </>
  )
}
