import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { posthog } from "@/lib/posthog";
import cleanersData from "@/data/cleaners.json";

type Cleaner = typeof cleanersData[0];

interface LandingPageProps {
  theme: "a" | "b" | "c";
  onToggleTheme?: () => void;
  isDev?: boolean;
}

export function LandingPage({ theme, onToggleTheme, isDev }: LandingPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null);

  function handleMoreToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handlePhoneClick(cleaner: Cleaner) {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
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
      <header className="w-full px-5 md:px-10 py-3.5 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            Temecula &amp; Murrieta
          </span>
          {isDev && (
            <button
              onClick={onToggleTheme}
              className="ml-3 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap"
            >
              Theme {theme.toUpperCase()}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 md:px-8 py-10">
        {/* ── Hero ── */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight mb-3">
            Find a house cleaner your neighbors{" "}
            <span className="text-primary">actually trust</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Local cleaning services in Murrieta and Temecula — vetted, reviewed,
            and ready to help.
          </p>
        </div>

        {/* ── Murrieta section ── */}
        <CleanerSection
          title="Murrieta"
          cleaners={murrieta}
          expandedId={expandedId}
          onToggle={handleMoreToggle}
          onPhoneClick={handlePhoneClick}
          onBookOnline={handleBookOnline}
        />

        {/* ── Temecula section ── */}
        <CleanerSection
          title="Temecula"
          cleaners={temecula}
          expandedId={expandedId}
          onToggle={handleMoreToggle}
          onPhoneClick={handlePhoneClick}
          onBookOnline={handleBookOnline}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Vouched Cleaners &bull; Temecula
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
      {/* Card header row */}
      <div className="flex items-center justify-between px-4 py-4 gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{cleaner.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {cleaner.services.slice(0, 3).join(" · ")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          aria-expanded={expanded}
          className="shrink-0 gap-1"
        >
          {expanded ? (
            <>Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </Button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
          <a
            href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
            onClick={onPhoneClick}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Phone className="w-4 h-4 shrink-0" />
            {cleaner.phone}
          </a>
          <Button
            size="sm"
            onClick={onBookOnline}
            className="sm:ml-auto"
          >
            Book Online
          </Button>
        </div>
      )}
    </div>
  );
}
