import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cards that pin and stack as the page scrolls.
 *
 * Each card sticks at the top of the viewport while the next one rises over
 * it. The card underneath scales down and dims, driven by the *next* card's
 * scroll position, which is what makes the two movements read as one gesture
 * rather than two independent animations.
 *
 * Under prefers-reduced-motion the whole thing collapses to a plain vertical
 * list, which is also what happens below the tablet breakpoint where pinning
 * costs more than it gives.
 */
export function StackCards({
  cards,
  onActive,
  className = "",
}: {
  cards: ReactNode[];
  onActive?: (index: number) => void;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const report = useRef(onActive);
  report.current = onActive;

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 860px)");

    let context: gsap.Context | null = null;

    const build = () => {
      context?.revert();
      context = null;
      node.dataset.pinned = "false";

      if (reduce.matches || narrow.matches) return;

      context = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".stack-card", node);
        if (items.length < 2) return;
        node.dataset.pinned = "true";

        items.forEach((card, i) => {
          const isLast = i === items.length - 1;

          if (!isLast) {
            ScrollTrigger.create({
              trigger: card,
              start: "top 96px",
              endTrigger: items[items.length - 1],
              end: "top 96px",
              pin: true,
              pinSpacing: false,
            });

            /* The card underneath clears out entirely before the next one
               lands, rather than lingering at partial opacity. Four cards
               half-visible behind each other is a pile, not a stack. The
               fade finishes early (at 62% of the travel) so the incoming
               card arrives on a clean surface. */
            gsap.to(card.querySelector(".stack-card-in"), {
              scale: 0.9,
              opacity: 0,
              y: -28,
              ease: "none",
              scrollTrigger: {
                trigger: items[i + 1],
                start: "top 92%",
                end: "top 38%",
                scrub: 0.4,
              },
            });
          }

          ScrollTrigger.create({
            trigger: card,
            start: "top 55%",
            end: isLast ? "bottom 45%" : "bottom 55%",
            onToggle: (self) => self.isActive && report.current?.(i),
          });
        });
      }, node);
    };

    build();
    const onResize = () => ScrollTrigger.refresh();
    reduce.addEventListener("change", build);
    narrow.addEventListener("change", build);
    window.addEventListener("resize", onResize);

    return () => {
      context?.revert();
      reduce.removeEventListener("change", build);
      narrow.removeEventListener("change", build);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`stack ${className}`} ref={wrap}>
      {cards.map((card, i) => (
        <div className="stack-card" key={i} style={{ zIndex: i + 1 }}>
          <div className="stack-card-in">{card}</div>
        </div>
      ))}
    </div>
  );
}
