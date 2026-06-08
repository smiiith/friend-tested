import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
      <img
        src="/logos/friend-tested-cleaners-dark-blue.png"
        alt="Vetted Local Cleaners"
        className="h-14 w-auto mb-8"
      />
      <h1 className="text-5xl font-extrabold text-foreground mb-3">404</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        That area isn't on our map yet. Try one of our supported cities.
      </p>
      <Link
        to="/"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Temecula Valley
      </Link>
    </div>
  );
}
