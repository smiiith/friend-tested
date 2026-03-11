import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { FalseDoorModal } from "@/components/FalseDoorModal"
import { posthog } from "@/lib/posthog"

interface LandingPageProps {
  theme: "a" | "b"
  onToggleTheme?: () => void
  isDev?: boolean
}

export function LandingPage({ theme, onToggleTheme, isDev }: LandingPageProps) {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  function handleCTA() {
    posthog.capture("cta_clicked", {
      button_label: "Get Early Access",
      // ab_theme is also sent automatically via the super property registered in App.tsx
    })
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setModalOpen(true)
    }, 1200)
  }

  const benefits = [
    "Search local cleaners your friends and neighbors have actually used",
    "See who vouched for each cleaner and why — real people, not strangers",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Nav ── */}
      <header className="w-full px-5 md:px-10 py-3.5 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <Logo size="sm" />
        {isDev && (
          <button
            onClick={onToggleTheme}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap"
          >
            Theme {theme.toUpperCase()}
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col">

        {/* ── Hero ── */}
        {/*
          Mobile:  image strip (top) → copy below
          Desktop: copy left (55%) | image right (45%), fills viewport height
        */}
        <section className="flex flex-col md:flex-row md:min-h-[calc(100vh-57px)]">

          {/* Image — top strip on mobile, right column on desktop */}
          <div className="
            order-1
            w-full h-[45vw] max-h-[260px] shrink-0
            md:order-2 md:w-[45%] md:h-auto md:max-h-none
            relative overflow-hidden
          ">
            <img
              src="/hero.png"
              alt="Two professional house cleaners smiling in a bright kitchen"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>

          {/* Copy — below image on mobile, left column on desktop */}
          <div className="
            order-2
            flex-1 flex flex-col justify-center
            px-5 py-10
            sm:px-8
            md:order-1 md:px-12 md:py-0
            lg:px-20
          ">
            <div className="w-full max-w-lg">

              {/* Location badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Temecula &amp; Murrieta
              </div>

              {/* Headline — differentiator-led */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
                Find a house cleaner your neighbors{" "}
                <span className="text-primary">actually trust</span>
              </h1>

              {/* Subheadline — one clear sentence */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-7">
                Vouched Cleaners connects Temecula &amp; Murrieta homeowners
                with local cleaners recommended by people they know —
                not anonymous reviews.
              </p>

              {/* Benefits — 2 only, distinct from each other */}
              <ul className="flex flex-col gap-3 mb-9">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm sm:text-base text-foreground/80">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  size="xl"
                  onClick={handleCTA}
                  disabled={loading}
                  className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-shadow"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Checking your area…
                    </span>
                  ) : (
                    "Get Early Access →"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Free &bull; No credit card needed
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Brand strip ── */}
        {/* Recreates the hero-text-only image as HTML + SVG */}
        <section className="
          border-t border-border/40
          bg-gradient-to-br from-white via-slate-50 to-blue-50/60
          flex items-center justify-center
          py-10 px-8 sm:px-12
        ">
          <div className="flex flex-col items-start w-full max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
              <svg
                viewBox="0 0 52 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-14 h-14 sm:w-[72px] sm:h-[72px] md:w-20 md:h-20 shrink-0"
              >
                <path
                  d="M3 22L26 3L49 22V45H3V22Z"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M12 28L21.5 38L40 17"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-[2rem] sm:text-4xl md:text-5xl font-bold tracking-tight leading-none"
                style={{ color: "#2563EB" }}
              >
                Vouched Cleaners
              </span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-snug">
              House cleaners vouched by people you know
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-4 px-5 md:px-10">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Vouched Cleaners &bull; Temecula &amp; Murrieta, CA
        </p>
      </footer>

      <FalseDoorModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
