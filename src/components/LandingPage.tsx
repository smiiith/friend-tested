import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Phone, MapPin } from "lucide-react";
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

type Cleaner = (typeof cleanersData)[0];

export function LandingPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null);

  useEffect(() => {
    document.title =
      "Friend Tested Cleaners | House Cleaners in Murrieta & Temecula, CA";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Find vetted local house cleaners and maid services in Murrieta and Temecula, CA. Browse cleaning services recommended by your neighbors.",
      );
    }
  }, []);

  function handleMoreToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handlePhoneClick(cleaner: Cleaner) {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
      page: "directory",
    });
  }

  function handleBookOnline(cleaner: Cleaner) {
    setBookingCleaner(cleaner);
  }

  const murrieta = cleanersData.filter((c) => c.city === "Murrieta");
  const temecula = cleanersData.filter((c) => c.city === "Temecula");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav ── */}
      <header className="w-full px-5 md:px-10 py-4 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <img
          src="/logos/friend-tested-cleaners-dark-blue.png"
          alt="Friend Tested Cleaners"
          className="h-14 w-auto"
        />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          Temecula &amp; Murrieta, CA
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img
          src="/hero/temecula-park-1-min.png"
          alt="Temecula park and lake"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        {/* Text */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3 drop-shadow">
            House Cleaners in Murrieta &amp; Temecula
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-md">
            Vetted local cleaning services recommended by your neighbors — not
            anonymous reviews.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 md:px-8 py-10">
        {/* ── Murrieta section ── */}
        <CleanerSection
          title="House Cleaners in Murrieta, CA"
          cleaners={murrieta}
          expandedId={expandedId}
          onToggle={handleMoreToggle}
          onPhoneClick={handlePhoneClick}
          onBookOnline={handleBookOnline}
        />

        {/* ── Temecula section ── */}
        <CleanerSection
          title="House Cleaners in Temecula, CA"
          cleaners={temecula}
          expandedId={expandedId}
          onToggle={handleMoreToggle}
          onPhoneClick={handlePhoneClick}
          onBookOnline={handleBookOnline}
        />

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
        <section className="mt-4 pt-8 border-t border-border/50 prose prose-sm max-w-none text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Finding a Reliable Maid Service in Murrieta &amp; Temecula
          </h2>
          <p className="text-sm leading-relaxed">
            Whether you need weekly housekeeping, a one-time deep clean, or a
            move-out cleaning in Murrieta or Temecula, the right cleaner makes
            all the difference. Friend Tested Cleaners is a directory of local
            home cleaning services in the Temecula Valley — from established
            franchises like MaidPro and Molly Maid to independent cleaners who
            know your neighborhood by name. Browse listings above to find a
            house cleaner near you, or click any name to learn more about their
            services and coverage area.
          </p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10 mt-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Friend Tested Cleaners &bull;
          Temecula &amp; Murrieta, CA
        </p>
      </footer>

      {/* ── Book Online Dialog ── */}
      <Dialog
        open={bookingCleaner !== null}
        onOpenChange={(open) => {
          if (!open) setBookingCleaner(null);
        }}
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

interface CleanerSectionProps {
  title: string;
  cleaners: Cleaner[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  onPhoneClick: (cleaner: Cleaner) => void;
  onBookOnline: (cleaner: Cleaner) => void;
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
            onToggle={() => onToggle(cleaner.id)}
            onPhoneClick={() => onPhoneClick(cleaner)}
            onBookOnline={() => onBookOnline(cleaner)}
          />
        ))}
      </div>
    </section>
  );
}

interface CleanerCardProps {
  cleaner: Cleaner;
  expanded: boolean;
  onToggle: () => void;
  onPhoneClick: () => void;
  onBookOnline: () => void;
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
            to={`/cleaners/${cleaner.id}`}
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
            <>Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </Button>
      </div>

      {/* Service chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {cleaner.services.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
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
  );
}
