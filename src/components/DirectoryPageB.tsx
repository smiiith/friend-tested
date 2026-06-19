"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, MapPin } from "lucide-react"
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

export function DirectoryPageB({ area }: { area: Area }) {
  const [filter, setFilter] = useState<string>("all")
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null)

  const areaCleaners = cleanersData.filter((c) =>
    (area.cities as string[]).includes(c.city),
  )
  const areaNeighborhoods = neighborhoodsData.filter((n) =>
    (area.cities as string[]).includes(n.city),
  )
  const filtered =
    filter === "all"
      ? areaCleaners
      : areaCleaners.filter((c) => c.city === filter)

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

  function handleCityFilter(city: string) {
    posthog.capture("city_filter_clicked", {
      city,
      area: area.id,
    })
    setFilter(city)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Hero banner ── */}
      <header className="bg-card border-b border-border py-12 px-5 text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/logos/friend-tested-cleaners-black.png"
            alt="Vetted Local Cleaners"
            className="h-20 w-auto"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight text-foreground">
          Find a House Cleaner Near You
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-base">
          Browse house cleaners, maid services, and cleaning companies in{" "}
          {area.heroTagline}
        </p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-5 md:px-8 py-10">
        {/* ── City filter tabs ── */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["all", ...area.cities] as string[]).map((city) => (
            <button
              key={city}
              onClick={() => handleCityFilter(city)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === city
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {city === "all" ? "All Cleaners" : city}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground self-center">
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── 2-column card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {filtered.map((cleaner) => (
            <CleanerCardB
              key={cleaner.id}
              cleaner={cleaner}
              onPhoneClick={() => handlePhoneClick(cleaner)}
              onBookOnline={() => handleBookOnline(cleaner)}
            />
          ))}
        </div>

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
        <section className="mt-12 pt-8 border-t border-border/50 text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground mb-2">
            {area.seoSection.heading}
          </h2>
          <p className="text-sm leading-relaxed">{area.seoSection.body}</p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10 mt-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Vetted Cleaners &bull;{" "}
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

function CleanerCardB({
  cleaner,
  onPhoneClick,
  onBookOnline,
}: {
  cleaner: Cleaner
  onPhoneClick: () => void
  onBookOnline: () => void
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 bg-primary" />

      <div className="p-5 flex flex-col flex-1">
        {/* City badge */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent mb-2">
          <MapPin className="w-3 h-3" />
          {cleaner.city}, CA
        </span>

        {/* Name — links to detail page */}
        <Link
          href={`/cleaners/${cleaner.id}`}
          className="font-bold text-lg text-foreground hover:text-primary hover:underline leading-snug mb-2"
        >
          {cleaner.name}
        </Link>

        {/* Description preview */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {cleaner.description}
        </p>

        {/* Service chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {cleaner.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Contact row — always visible */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center gap-3">
          <a
            href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
            onClick={onPhoneClick}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Phone className="w-4 h-4 shrink-0" />
            {cleaner.phone}
          </a>
          <Button size="sm" onClick={onBookOnline} className="ml-auto">
            Book Online
          </Button>
        </div>
      </div>
    </div>
  )
}
