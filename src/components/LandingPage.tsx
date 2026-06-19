"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { posthog } from "@/lib/posthog"
import cleanersData from "@/data/cleaners.json"
import neighborhoodsData from "@/data/neighborhoods.json"
import areasData from "@/data/areas.json"

type Cleaner = (typeof cleanersData)[0]
type Area = (typeof areasData)[0]

export function LandingPage({ area }: { area: Area }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null)

  const areaCleaners = cleanersData.filter((c) =>
    (area.cities as string[]).includes(c.city),
  )
  const areaNeighborhoods = neighborhoodsData.filter((n) =>
    (area.cities as string[]).includes(n.city),
  )

  function handleMoreToggle(_id: string, cleaner: Cleaner) {
    setExpandedId((prev) => {
      const opening = prev !== cleaner.id
      if (opening) {
        posthog.capture("contact_clicked", {
          cleaner_id: cleaner.id,
          cleaner_name: cleaner.name,
          cleaner_city: cleaner.city,
          page: "directory",
          area: area.id,
        })
      }
      return opening ? cleaner.id : null
    })
  }

  function handlePhoneClick(cleaner: Cleaner) {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
      page: "directory",
      area: area.id,
    })
  }

  function handleBookOnline(cleaner: Cleaner) {
    posthog.capture("book_online_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
      page: "directory",
      area: area.id,
    })
    setBookingCleaner(cleaner)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav ── */}
      <header className="w-full px-5 md:px-10 py-4 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <img
          src="/logos/friend-tested-cleaners-dark-blue.png"
          alt="Vetted Local Cleaners"
          className="h-14 w-auto"
        />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {area.displayName}, CA
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img
          src={area.heroImage}
          alt={area.heroAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 max-w-2xl">
          <img
            src="/logos/friend-tested-cleaners-light-blue.png"
            alt="Vetted Local Cleaners"
            className="h-12 w-auto self-start mb-3 drop-shadow"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 drop-shadow">
            Find a House Cleaner Near You
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-md mb-3">
            Browse house cleaners, maid services, and cleaning companies in{" "}
            {area.heroTagline}
          </p>
          <p className="text-xs text-white/60 font-medium tracking-wide uppercase">
            {areaCleaners.length} cleaner{areaCleaners.length !== 1 ? "s" : ""}{" "}
            &bull; {area.name}
          </p>
        </div>
      </section>

      <main className="flex-1 w-full">
        {area.cities.map((city, idx) => {
          const cleaners = cleanersData.filter((c) => c.city === city)
          const tinted = idx % 2 === 1

          const section = (
            <CleanerSection
              title={`House Cleaners in ${city}, CA`}
              cleaners={cleaners}
              expandedId={expandedId}
              onToggle={handleMoreToggle}
              onPhoneClick={handlePhoneClick}
              onBookOnline={handleBookOnline}
            />
          )

          if (tinted) {
            return (
              <div
                key={city}
                className="w-full bg-primary/5 border-y border-border/40 py-10"
              >
                <div className="max-w-4xl mx-auto px-5 md:px-8">{section}</div>
              </div>
            )
          }
          return (
            <div key={city} className="max-w-4xl mx-auto px-5 md:px-8 pt-10">
              {section}
            </div>
          )
        })}

        <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
          {/* ── Browse by neighborhood ── */}
          {areaNeighborhoods.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/60">
                Browse by Neighborhood
              </h2>
              <div className="flex flex-wrap gap-2">
                {areaNeighborhoods.map((n) => (
                  <Link
                    key={n.id}
                    href={`/neighborhoods/${n.id}`}
                    className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {n.name}, {n.city}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── SEO body copy ── */}
          <section className="mt-4 pt-8 border-t border-border/50 prose prose-sm max-w-none text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground mb-2">
              {area.seoSection.heading}
            </h2>
            <p className="text-sm leading-relaxed">{area.seoSection.body}</p>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-6 px-5 md:px-10">
        <p className="text-xs text-center text-muted-foreground mb-1">
          Vetted Local Cleaners is a community-curated directory, not a paid
          listing service. Every cleaner is independently operated and serves{" "}
          {area.name}.
        </p>
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Vetted Local Cleaners &bull;{" "}
          {area.displayName}, CA
        </p>
      </footer>

      {/* ── Book Online Dialog ── */}
      <Dialog
        open={bookingCleaner !== null}
        onOpenChange={(open) => {
          if (!open) setBookingCleaner(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Online Booking Unavailable</DialogTitle>
            <DialogDescription>
              {bookingCleaner?.name} doesn&apos;t support online booking yet.
              Please call them directly to schedule:
            </DialogDescription>
          </DialogHeader>
          {bookingCleaner && (
            <a
              href={`tel:${bookingCleaner.phone.replace(/\D/g, "")}`}
              onClick={() => handlePhoneClick(bookingCleaner)}
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
            >
              <Phone className="w-5 h-5" />
              {bookingCleaner.phone}
            </a>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CleanerSectionProps {
  title: string
  cleaners: Cleaner[]
  expandedId: string | null
  onToggle: (id: string, cleaner: Cleaner) => void
  onPhoneClick: (cleaner: Cleaner) => void
  onBookOnline: (cleaner: Cleaner) => void
}

function CleanerSection({
  title,
  cleaners,
  expandedId,
  onToggle,
  onPhoneClick,
  onBookOnline,
}: CleanerSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/60">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {cleaners.map((cleaner) => (
          <CleanerCard
            key={cleaner.id}
            cleaner={cleaner}
            expanded={expandedId === cleaner.id}
            onToggle={() => onToggle(cleaner.id, cleaner)}
            onPhoneClick={() => onPhoneClick(cleaner)}
            onBookOnline={() => onBookOnline(cleaner)}
          />
        ))}
      </div>
    </section>
  )
}

interface CleanerCardProps {
  cleaner: Cleaner
  expanded: boolean
  onToggle: () => void
  onPhoneClick: () => void
  onBookOnline: () => void
}

function CleanerCard({
  cleaner,
  expanded,
  onToggle,
  onPhoneClick,
  onBookOnline,
}: CleanerCardProps) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card shadow-sm overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-primary/30" />

      {/* Card header row */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/cleaners/${cleaner.id}`}
            className="font-semibold text-foreground hover:text-primary hover:underline block mb-1.5"
          >
            {cleaner.name}
          </Link>
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
            {cleaner.description}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          aria-expanded={expanded}
          className="shrink-0 gap-1 mt-0.5"
        >
          {expanded ? (
            <>
              Close <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Contact <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Service chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {cleaner.services.slice(0, 3).map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
          <a
            href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
            onClick={onPhoneClick}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Phone className="w-4 h-4 shrink-0" />
            {cleaner.phone}
          </a>
          <Button size="sm" onClick={onBookOnline} className="sm:ml-auto">
            Book Online
          </Button>
        </div>
      )}
    </div>
  )
}
