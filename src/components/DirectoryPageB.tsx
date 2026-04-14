import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { posthog } from "@/lib/posthog";
import cleanersData from "@/data/cleaners.json";
import neighborhoodsData from "@/data/neighborhoods.json";

type Cleaner = typeof cleanersData[0];
type CityFilter = "all" | "Murrieta" | "Temecula";

export function DirectoryPageB() {
  const [filter, setFilter] = useState<CityFilter>("all");
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null);

  useEffect(() => {
    document.title = "Friend Tested Cleaners | Trusted House Cleaners in Murrieta & Temecula, CA";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Find vetted local house cleaners and maid services in Murrieta and Temecula, CA. Browse trusted cleaning services recommended by your neighbors."
      );
    }
  }, []);

  const filtered =
    filter === "all" ? cleanersData : cleanersData.filter((c) => c.city === filter);

  function handlePhoneClick(cleaner: Cleaner) {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
      page: "directory",
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Hero banner ── */}
      <header className="bg-card border-b border-border py-12 px-5 text-center">
        <div className="flex justify-center mb-6">
          <img src="/logos/friend-tested-cleaners-black.png" alt="Friend Tested Cleaners" className="h-20 w-auto" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight text-foreground">
          Trusted House Cleaners in<br className="hidden sm:block" /> Murrieta &amp; Temecula
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-base">
          Browse local maid services and cleaning companies serving Murrieta,
          Temecula, and the Temecula Valley — vetted and recommended by your neighbors.
        </p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-5 md:px-8 py-10">
        {/* ── City filter tabs ── */}
        <div className="flex gap-2 mb-8">
          {(["all", "Murrieta", "Temecula"] as CityFilter[]).map((city) => (
            <button
              key={city}
              onClick={() => setFilter(city)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((cleaner) => (
            <CleanerCardB
              key={cleaner.id}
              cleaner={cleaner}
              onPhoneClick={() => handlePhoneClick(cleaner)}
              onBookOnline={() => setBookingCleaner(cleaner)}
            />
          ))}
        </div>

        {/* ── Browse by neighborhood ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/60">
            Browse by Neighborhood
          </h2>
          <div className="flex flex-wrap gap-2">
            {neighborhoodsData.map((n) => (
              <Link
                key={n.id}
                to={`/neighborhoods/${n.id}`}
                className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {n.name}, {n.city}
              </Link>
            ))}
          </div>
        </section>

        {/* ── SEO body copy ── */}
        <section className="mt-12 pt-8 border-t border-border/50 text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Finding a Reliable Maid Service in Murrieta &amp; Temecula
          </h2>
          <p className="text-sm leading-relaxed">
            Whether you need weekly housekeeping, a one-time deep clean, or a
            move-out cleaning in Murrieta or Temecula, the right cleaner makes
            all the difference. Friend Tested Cleaners is a directory of local home
            cleaning services in the Temecula Valley — from established
            franchises like MaidPro and Molly Maid to trusted independent
            cleaners who know your neighborhood by name. Browse listings above
            to find a house cleaner near you, or click any name to learn more.
          </p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10 mt-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Friend Tested Cleaners &bull; Temecula
          &amp; Murrieta, CA
        </p>
      </footer>

      {/* ── Book Online Dialog ── */}
      <Dialog
        open={bookingCleaner !== null}
        onOpenChange={(open) => { if (!open) setBookingCleaner(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Online Booking Unavailable</DialogTitle>
            <DialogDescription>
              {bookingCleaner?.name} doesn't support online booking yet. Please
              call them directly to schedule:
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
  );
}

function CleanerCardB({
  cleaner,
  onPhoneClick,
  onBookOnline,
}: {
  cleaner: Cleaner;
  onPhoneClick: () => void;
  onBookOnline: () => void;
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
          to={`/cleaners/${cleaner.id}`}
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
  );
}
