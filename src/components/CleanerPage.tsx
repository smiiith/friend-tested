import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, MapPin, ArrowLeft } from "lucide-react";
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

interface CleanerPageProps {
  theme: "a" | "b" | "c";
  onToggleTheme?: () => void;
  isDev?: boolean;
}

export function CleanerPage({ theme, onToggleTheme, isDev }: CleanerPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [bookingOpen, setBookingOpen] = useState(false);

  const cleaner = cleanersData.find((c) => c.id === slug) as Cleaner | undefined;

  const relatedCleaners = cleaner
    ? cleanersData.filter((c) => c.city === cleaner.city && c.id !== cleaner.id).slice(0, 3)
    : [];

  useEffect(() => {
    if (!cleaner) return;
    const slug = cleaner.id;
    const pageUrl = `https://friendtested.pro/cleaners/${slug}`;

    // Title + meta description
    document.title = `${cleaner.name} | House Cleaning in ${cleaner.city}, CA | Vouched Cleaners`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cleaner.description.slice(0, 155) + "…");

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    // JSON-LD: LocalBusiness for this cleaner
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": pageUrl,
      "name": cleaner.name,
      "description": cleaner.description,
      "telephone": cleaner.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": cleaner.address,
        "addressLocality": cleaner.city,
        "addressRegion": "CA",
        "addressCountry": "US"
      },
      "areaServed": cleaner.serviceArea.map((area) => ({
        "@type": "City",
        "name": area
      })),
      "url": pageUrl,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": cleaner.services.map((s) => ({
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": s }
        }))
      }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "cleaner-jsonld";
    script.textContent = JSON.stringify(schema);
    document.head.querySelector("#cleaner-jsonld")?.remove();
    document.head.appendChild(script);

    return () => {
      document.head.querySelector("#cleaner-jsonld")?.remove();
      canonical?.remove();
    };
  }, [cleaner]);

  if (!cleaner) return <Navigate to="/" replace />;

  function handlePhoneClick() {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner!.id,
      cleaner_name: cleaner!.name,
      cleaner_city: cleaner!.city,
      page: "cleaner_detail",
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav ── */}
      <header className="w-full px-5 md:px-10 py-3.5 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            Temecula &amp; Murrieta, CA
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

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-8 py-10">
        {/* ── Back link ── */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All house cleaners in Murrieta &amp; Temecula
        </Link>

        {/* ── Cleaner header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            <MapPin className="w-3 h-3" />
            {cleaner.city}, CA
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight mb-2">
            {cleaner.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            House cleaning service in {cleaner.city}, CA &bull; Also serving:{" "}
            {cleaner.serviceArea.filter((a) => a !== cleaner.city).join(", ")}
          </p>
        </div>

        {/* ── Contact actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 p-5 rounded-[var(--radius)] border border-border bg-card shadow-sm">
          <a
            href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
            onClick={handlePhoneClick}
            className="inline-flex items-center gap-2 text-xl font-bold text-primary hover:underline"
          >
            <Phone className="w-5 h-5 shrink-0" />
            {cleaner.phone}
          </a>
          <Button
            size="lg"
            onClick={() => setBookingOpen(true)}
            className="sm:ml-auto"
          >
            Book Online
          </Button>
        </div>

        {/* ── Services ── */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {cleaner.services.map((service) => (
              <span
                key={service}
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* ── About ── */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">
            About {cleaner.name}
          </h2>
          <p className="text-base text-foreground/80 leading-relaxed">
            {cleaner.description}
          </p>
        </div>

        {/* ── Service area ── */}
        <div className="mb-10 p-5 rounded-[var(--radius)] border border-border/60 bg-secondary/30">
          <h2 className="text-base font-semibold text-foreground mb-1">Service Area</h2>
          <p className="text-sm text-muted-foreground">
            {cleaner.name} serves homeowners in{" "}
            {cleaner.serviceArea.join(", ")} and surrounding Temecula Valley communities.
          </p>
        </div>

        {/* ── Related cleaners ── */}
        {relatedCleaners.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Other House Cleaners in {cleaner.city}, CA
            </h2>
            <div className="flex flex-col gap-3">
              {relatedCleaners.map((related) => (
                <Link
                  key={related.id}
                  to={`/cleaners/${related.id}`}
                  className="flex items-center justify-between px-4 py-3 rounded-[var(--radius)] border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {related.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {related.services.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/"
                className="text-sm text-primary hover:underline"
              >
                View all house cleaners in Murrieta &amp; Temecula →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10 mt-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Vouched Cleaners &bull; Temecula
          &amp; Murrieta, CA
        </p>
      </footer>

      {/* ── Book Online Dialog ── */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Online Booking Unavailable</DialogTitle>
            <DialogDescription>
              {cleaner.name} doesn't support online booking yet. Please call
              them directly to schedule:
            </DialogDescription>
          </DialogHeader>
          <a
            href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
            onClick={handlePhoneClick}
            className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
          >
            <Phone className="w-5 h-5" />
            {cleaner.phone}
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}
