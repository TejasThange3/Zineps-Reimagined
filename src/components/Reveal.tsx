import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger index. Multiplied by 55ms, capped so long lists never crawl. */
  index?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
  /** Travel distance in px. 0 gives a pure fade, used for large surfaces. */
  shift?: number;
};

/**
 * Scroll entry. One IntersectionObserver per element, disconnected the moment
 * it fires, so nothing stays subscribed after the reveal has happened.
 *
 * The motion itself is CSS, which keeps it off the main thread and means it
 * stays smooth while the rest of the page is still loading.
 */
export function Reveal({
  children,
  index = 0,
  as: Tag = "div",
  className = "",
  shift = 18,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        /* Reveal when the element comes into view, and also when it is
           already above the viewport. A jump straight to an anchor, or the
           back button restoring a deep scroll position, can put an element
           past the fold without it ever having intersected, and it would
           otherwise stay invisible for the rest of the session. */
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-shown={shown}
      style={
        {
          "--reveal-delay": `${Math.min(index, 8) * 55}ms`,
          "--reveal-shift": `${shift}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
