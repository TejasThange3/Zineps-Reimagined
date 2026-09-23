/**
 * One pointer listener for every spotlit card on the site.
 *
 * Any element with the `spot` class gets the cursor's position written to it
 * as --sx / --sy while the pointer is over it, and a data-spot-on flag while
 * it is inside. The CSS draws the rest: a light on the card's edge nearest
 * the cursor, and a faint fill beneath it.
 *
 * Delegated from the document rather than attached per card, so a grid of
 * thirty-two directory tiles costs one listener, and writes are batched to
 * one per animation frame. Mouse only: on touch there is no hover to answer.
 */
export function installSpotlight() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let current: HTMLElement | null = null;
  let frame = 0;
  let last: PointerEvent | null = null;

  const paint = () => {
    frame = 0;
    const event = last;
    if (!event) return;

    const target = (event.target as Element | null)?.closest<HTMLElement>(".spot") ?? null;

    if (target !== current) {
      current?.removeAttribute("data-spot-on");
      current = target;
      current?.setAttribute("data-spot-on", "");
    }
    if (!current) return;

    const box = current.getBoundingClientRect();
    current.style.setProperty("--sx", `${event.clientX - box.left}px`);
    current.style.setProperty("--sy", `${event.clientY - box.top}px`);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    },
    { passive: true },
  );

  document.addEventListener("pointerleave", () => {
    current?.removeAttribute("data-spot-on");
    current = null;
  });
}
