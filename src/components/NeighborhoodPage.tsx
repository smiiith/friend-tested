import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { posthog } from "@/lib/posthog";
import neighborhoodsData from "@/data/neighborhoods.json";
import cleanersData from "@/data/cleaners.json";

type Neighborhood = typeof neighborhoodsData[0];
type Cleaner = typeof cleanersData[0];

export function NeighborhoodPage({ theme }: { theme: "a" | "b" }) {
  const { slug } = useParams<{ slug: string }>();
  const [bookingCleaner, setBookingCleaner] = useState<Cleaner | null>(null);

  const neighborhood = neighborhoodsData.find((n) => n.id === slug) as Neighborhood | undefined;

  const logo =
    theme === "b"
      ? "/logos/friend-tested-cleaners-black.png"
      : "/logos/friend-tested-cleaners-dark-blue.png";

  const cleaners = neighborhood
    ? cleanersData.filter((c) => c.serviceArea.includes(neighborhood.matchCity))
    : [];

  const otherNeighborhoods = neighborhood
    ? neighborhoodsData.filter((n) => n.id !== neighborhood.id)
    : [];

  useEffect(() => {
    if (!neighborhood) return;
    const pageUrl = `https://friendtested.pro/neighborhoods/${neighborhood.id}`;
    const metaTitle = `House Cleaners in ${neighborhood.name}, ${neighborhood.city} CA | Friend Tested Cleaners`;
    const metaDesc = `Find trusted house cleaners and maid services in ${neighborhood.name}, ${neighborhood.city}, CA. Browse local cleaning services serving ${neighborhood.name} and surrounding ${neighborhood.city} communities.`;

    document.title = metaTitle;

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) metaDescTag.setAttribute("content", metaDesc);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    // OG + Twitter tags
    const ogTags: Record<string, string> = {
      "og:title": metaTitle,
      "og:description": metaDesc,
      "og:url": pageUrl,
      "og:type": "website",
      "twitter:title": metaTitle,
      "twitter:description": metaDesc,
    };
    const createdMeta: HTMLMetaElement[] = [];
    for (const [property, content] of Object.entries(ogTags)) {
      const attr = property.startsWith("twitter:") ? "name" : "property";
      let tag = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, property);
        document.head.appendChild(tag);
        createdMeta.push(tag);
      }
      tag.setAttribute("content", content);
    }

    // JSON-LD: BreadcrumbList + ItemList of cleaners
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://friendtested.pro/" },
            { "@type": "ListItem", "position": 2, "name": `House Cleaners in ${neighborhood.city}`, "item": "https://friendtested.pro/" },
            { "@type": "ListItem", "position": 3, "name": `${neighborhood.name}, ${neighborhood.city}`, "item": pageUrl }
          ]
        },
        {
          "@type": "ItemList",
          "name": `House Cleaners serving ${neighborhood.name}, ${neighborhood.city} CA`,
          "url": pageUrl,
          "itemListElement": cleaners.map((c, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": c.name,
            "url": `https://friendtested.pro/cleaners/${c.id}`
          }))
        }
      ]
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "neighborhood-jsonld";
    script.textContent = JSON.stringify(schema);
    document.head.querySelector("#neighborhood-jsonld")?.remove();
    document.head.appendChild(script);

    return () => {
      document.head.querySelector("#neighborhood-jsonld")?.remove();
      canonical?.remove();
      createdMeta.forEach((tag) => tag.remove());
    };
  }, [neighborhood, cleaners]);

  if (!neighborhood) return <Navigate to="/" replace />;

  function handlePhoneClick(cleaner: Cleaner) {
    posthog.capture("phone_number_clicked", {
      cleaner_id: cleaner.id,
      cleaner_name: cleaner.name,
      cleaner_city: cleaner.city,
      page: "neighborhood",
      neighborhood: neighborhood!.id,
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav ── */}
      <header className="w-full px-5 md:px-10 py-4 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <img src={logo} alt="Friend Tested Cleaners" className="h-14 w-auto" />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          Temecula &amp; Murrieta, CA
        </span>
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

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            <MapPin className="w-3 h-3" />
            {neighborhood.city}, CA
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight mb-2">
            House Cleaners in {neighborhood.name}
          </h1>
          <p className="text-sm text-muted-foreground">{neighborhood.tagline}</p>
        </div>

        {/* ── About the neighborhood ── */}
        <div className="mb-10 flex flex-col gap-4">
          {neighborhood.paragraphs.map((p, i) => (
            <p key={i} className="text-base text-foreground/80 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* ── Cleaners ── */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/60">
            House Cleaning Services Serving {neighborhood.name}
          </h2>
          <div className="flex flex-col gap-3">
            {cleaners.map((cleaner) => (
              <div
                key={cleaner.id}
                className="rounded-[var(--radius)] border border-border bg-card shadow-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/cleaners/${cleaner.id}`}
                      className="font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {cleaner.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cleaner.services.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${cleaner.phone.replace(/\D/g, "")}`}
                      onClick={() => handlePhoneClick(cleaner)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {cleaner.phone}
                    </a>
                    <Button size="sm" onClick={() => setBookingCleaner(cleaner)}>
                      Book Online
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Other neighborhoods ── */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Other Neighborhoods We Cover
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherNeighborhoods.map((n) => (
              <Link
                key={n.id}
                to={`/neighborhoods/${n.id}`}
                className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {n.name}, {n.city}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Back to directory ── */}
        <div>
          <Link to="/" className="text-sm text-primary hover:underline">
            View all house cleaners in Murrieta &amp; Temecula →
          </Link>
        </div>
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
