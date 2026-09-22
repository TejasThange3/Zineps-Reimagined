import { useRef, type ReactNode } from "react";

/**
 * A panel that lights up under the cursor.
 *
 * The pointer position is written to CSS custom properties on the element
 * itself, never into React state, so moving the mouse costs one style write
 * per frame instead of a re-render of the subtree. A radial highlight and a
 * brightened border edge both read from those properties.
 *
 * `beam` adds a light travelling around the border, for the one or two
 * surfaces that should look live rather than merely present.
 */
export function Surface({
  children,
  className = "",
  beam = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  beam?: boolean;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--px", `${clientX - rect.left}px`);
      node.style.setProperty("--py", `${clientY - rect.top}px`);
    });
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--lit", "0");
  };
  const onEnter = () => {
    ref.current?.style.setProperty("--lit", "1");
  };

  return (
    <Tag
      ref={ref as never}
      className={`surface ${beam ? "surface-beam" : ""} ${className}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <span className="surface-glow" aria-hidden="true" />
      {beam ? <span className="surface-edge" aria-hidden="true" /> : null}
      <span className="surface-in">{children}</span>
    </Tag>
  );
}
