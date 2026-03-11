import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FalseDoorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FalseDoorModal({ open, onOpenChange }: FalseDoorModalProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTimeout(() => {
        setSubmitted(false)
        setEmail("")
        setError("")
      }, 300)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center text-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                You're on the waitlist!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We'll reach out to{" "}
                <strong className="text-foreground">{email}</strong> as soon as
                we have verified cleaners ready in your area.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          /* ── Waitlist state ── */
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                {/* Early access icon */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <DialogTitle>We're building out your area now</DialogTitle>
              </div>
              <DialogDescription className="text-sm leading-relaxed">
                Vouched Cleaners is in early access for Temecula &amp; Murrieta.
                We're verifying local cleaners now — join the waitlist and we'll
                reach out as soon as cleaners in your neighborhood are ready.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wl-email" className="text-sm font-medium text-foreground">
                  Your email address
                </label>
                <Input
                  id="wl-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  className="h-11"
                  autoFocus
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full mt-1" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving your spot…
                  </span>
                ) : (
                  "Join the Waitlist"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam. We'll only email you when your area is ready.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
