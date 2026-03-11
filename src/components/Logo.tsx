interface LogoProps {
  className?: string;
  /** Show the "House cleaners vouched by people you know" tagline */
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({
  className = "",
  showTagline = false,
  size = "md",
}: LogoProps) {
  const iconSize =
    size === "sm" ? 36 : size === "lg" ? 56 : size === "xl" ? 80 : 44;

  const titleClass =
    size === "sm"
      ? "text-lg font-bold"
      : size === "lg"
        ? "text-3xl font-bold"
        : size === "xl"
          ? "text-4xl sm:text-5xl font-bold"
          : "text-xl font-bold";

  const taglineClass =
    size === "xl" ? "text-base sm:text-lg mt-2" : "text-sm mt-1";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* House icon — matches brand reference */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 52 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* House pentagon outline */}
        <path
          d="M3 22L26 3L49 22V45H3V22Z"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Green checkmark */}
        <path
          d="M12 28L21.5 38L40 17"
          stroke="#22c55e"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`${titleClass} tracking-tight`}
          style={{ color: "#2563EB" }}
        >
          Vouched Cleaners
        </span>
        {showTagline && (
          <span className={`${taglineClass} font-normal text-muted-foreground`}>
            House cleaners vouched by people you know
          </span>
        )}
      </div>
    </div>
  );
}
