import { useRef } from "react";

/**
 * The closing wordmark.
 *
 * Set from the same dot grid the lane map and the globe are drawn with, so
 * the page ends on the site's own material rather than on a borrowed outline
 * trend. At rest the dots sit faint; under a fine pointer a second, mint copy
 * shows through a soft circle that follows the cursor, like lighting up a
 * region of the map.
 *
 * The spotlight is a CSS mask on a duplicate layer, driven by two custom
 * properties written straight to the element. Moving the pointer costs one
 * style write and a composite, never a React render or a per-dot update.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    // Measured against the lit layer itself, since the mask is drawn in its
    // own box and the wrapper carries the gutter padding.
    const lit = node.lastElementChild as SVGSVGElement | null;
    const box = (lit ?? node).getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - box.left}px`);
    node.style.setProperty("--my", `${event.clientY - box.top}px`);
    node.dataset.lit = "";
  };

  const leave = () => {
    const node = ref.current;
    if (node) delete node.dataset.lit;
  };

  const dots = (id: string) => (
    <defs>
      <pattern id={id} width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="4.5" cy="4.5" r="2.1" />
      </pattern>
    </defs>
  );

  /* One glyph run, two fills. The viewBox ends partway down the descender:
     the word runs off the page, but enough of the p stem stays in frame
     that it still reads as a p rather than an o. */
  const word = (fill: string) => (
    <text
      x="0"
      y="238"
      textLength="1000"
      lengthAdjust="spacingAndGlyphs"
      fill={fill}
    >
      zineps
    </text>
  );

  return (
    <div
      ref={ref}
      className="ftr-mark"
      aria-hidden="true"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <svg viewBox="0 0 1000 282" preserveAspectRatio="xMidYMax meet">
        {dots("ftr-dots")}
        <g className="ftr-mark-base">{word("url(#ftr-dots)")}</g>
      </svg>
      <svg
        className="ftr-mark-lit"
        viewBox="0 0 1000 282"
        preserveAspectRatio="xMidYMax meet"
      >
        {dots("ftr-dots-lit")}
        <g>{word("url(#ftr-dots-lit)")}</g>
      </svg>
    </div>
  );
}
