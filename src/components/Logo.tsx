/**
 * The supplied Zineps wordmark, used unmodified in aspect and shape.
 *
 * The one change is that the two fill colours are bound to theme tokens so
 * the mark stays legible in dark mode. Proportions, paths and the mint are
 * untouched.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/assets/brand/logo.svg"
      alt="Zineps"
      width={101}
      height={25}
      className={`logo ${className}`}
      decoding="async"
    />
  );
}
