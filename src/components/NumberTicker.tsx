import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up the first time it comes into view.
 *
 * Driven by requestAnimationFrame against a timestamp rather than a fixed
 * increment, so the duration holds regardless of frame rate, and written
 * straight to the DOM node instead of through state, so a two second count
 * does not cost a hundred React renders.
 *
 * The element reserves its final width up front, so the surrounding layout
 * never moves while the digits change.
 */
export function NumberTicker({
  value,
  decimals = 0,
  duration = 1600,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  const format = (n: number) =>
    prefix +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  useEffect(() => {
    const node = ref.current;
    if (!node || done) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDone(true);
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      // Ease out, so the count decelerates into its final value.
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = format(value * eased);
      if (t < 1) frame = requestAnimationFrame(step);
      else setDone(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // format is derived from props that are all in this list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration, prefix, suffix, done]);

  return (
    <span className={`ticker ${className}`}>
      {/* An invisible copy of the final value holds the width open. */}
      <span className="ticker-ghost" aria-hidden="true">
        {format(value)}
      </span>
      <span ref={ref} className="ticker-live">
        {done ? format(value) : format(0)}
      </span>
    </span>
  );
}
