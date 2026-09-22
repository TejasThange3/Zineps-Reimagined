import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

/**
 * A slowly turning globe for the scale band, with the network's cities marked
 * and live arcs running between them.
 *
 * cobe draws to a canvas on the GPU in a few kilobytes, which is a far better
 * trade than a Three.js scene for one decorative object. Rotation is driven
 * from our own frame loop through `update`, because cobe 2 dropped the
 * `onRender` callback in favour of imperative state.
 *
 * It only runs while on screen, and under prefers-reduced-motion it renders a
 * single static frame and stops.
 */

type City = [number, number];

/* Twelve hubs rather than twenty. The old set put eight markers inside
   Europe, which read as one smudge from orbit while Africa and the Pacific
   sat empty, and four of them were not on any arc. These are spread across
   the continents, and every one is an endpoint of at least two lanes. */
/* Eight hubs and seven lanes, all radiating from Amsterdam.
   Seventeen crossing arcs read as a spider web from any angle: the lines
   overlap, the eye cannot follow one, and the shape says nothing. A plain
   hub and spoke says the one thing this section is about, which is that
   everything runs back through one platform. */
const CITIES: Record<string, City> = {
  amsterdam: [52.37, 4.9],
  newyork: [40.71, -74.01],
  saopaulo: [-23.55, -46.63],
  johannesburg: [-26.2, 28.05],
  dubai: [25.2, 55.27],
  singapore: [1.35, 103.82],
  shanghai: [31.23, 121.47],
  sydney: [-33.87, 151.21],
};

const markers = Object.entries(CITIES).map(([name, location]) => ({
  location,
  size: name === "amsterdam" ? 0.12 : 0.06,
}));

const arcs = Object.keys(CITIES)
  .filter((name) => name !== "amsterdam")
  .map((name) => ({ from: CITIES.amsterdam, to: CITIES[name] }));

export function Globe({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const host = wrap.current;
    if (!node || !host) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let frame = 0;
    let width = 0;
    let phi = 4.2; // Europe facing the viewer
    let drag: number | null = null;
    let dragged = 0;

    const options: COBEOptions = {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: 0,
      height: 0,
      phi,
      theta: 0.26,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 19000,
      mapBrightness: 5.2,
      baseColor: [0.13, 0.23, 0.21],
      markerColor: [0.45, 0.86, 0.78],
      glowColor: [0.09, 0.2, 0.18],
      markers,
      arcs,
      arcColor: [0.45, 0.86, 0.78],
      arcWidth: 0.22,
      arcHeight: 0.28,
    };

    const tick = () => {
      if (!globe) return;
      if (drag === null) phi += 0.0022;
      globe.update({ phi: phi + dragged, width: width * 2, height: width * 2 });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (globe) return;
      width = host.offsetWidth;
      if (!width) return;

      globe = createGlobe(node, {
        ...options,
        width: width * 2,
        height: width * 2,
      });
      requestAnimationFrame(() => node.classList.add("is-ready"));
      if (!reduce) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      globe?.destroy();
      globe = null;
      node.classList.remove("is-ready");
    };

    /* A WebGL loop spinning behind three sections of scrolled content is pure
       battery drain, so it only runs while the globe is actually visible. */
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 },
    );
    observer.observe(host);

    const onDown = (event: PointerEvent) => {
      drag = event.clientX;
      node.setPointerCapture(event.pointerId);
      node.style.cursor = "grabbing";
    };
    const onMove = (event: PointerEvent) => {
      if (drag === null) return;
      dragged = (event.clientX - drag) / 200;
      if (reduce && globe) globe.update({ phi: phi + dragged });
    };
    const onUp = () => {
      if (drag === null) return;
      drag = null;
      // Keep where it was left rather than snapping back.
      phi += dragged;
      dragged = 0;
      node.style.cursor = "grab";
    };
    const onResize = () => {
      width = host.offsetWidth;
      if (reduce && globe)
        globe.update({ width: width * 2, height: width * 2 });
    };

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer.disconnect();
      stop();
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`globe ${className}`} ref={wrap}>
      <canvas ref={canvas} aria-hidden="true" />
      <p className="sr">
        A rotating globe marking the cities the Zineps network reaches, with
        lanes drawn between them.
      </p>
    </div>
  );
}
