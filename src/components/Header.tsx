import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/* useLayoutEffect warns during server rendering; the marker is client-only. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { openCommandMenu } from "./CommandMenu";

const products = [
  {
    href: "/shipping",
    title: "Shipping software",
    blurb: "Orders, rules, labels, tracking and returns for online stores.",
  },
  {
    href: "/logistics-operating-system",
    title: "Logistics operating system",
    blurb: "Contracts, customers, margins and support for carriers and 3PLs.",
  },
  {
    href: "/shipping-ai",
    title: "Shipping AI",
    blurb: "Delay prediction, routing and rate intelligence on every shipment.",
  },
];

const nav = [
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/knowledge-base", label: "Knowledge base" },
];

/** The palette's visible door. The shortcut label matches the platform. */
function SearchButton() {
  const [mod, setMod] = useState("⌘");
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setMod("Ctrl");
  }, []);
  return (
    <button
      type="button"
      className="hdr-search"
      onClick={openCommandMenu}
      aria-label="Search the site"
      aria-keyshortcuts="Meta+K Control+K"
    >
      <span className="hdr-search-glass" aria-hidden="true" />
      <span className="hdr-search-label">Search</span>
      <kbd className="hdr-search-kbd" aria-hidden="true">
        {mod} K
      </kbd>
    </button>
  );
}

export function Header({ path }: { path: string }) {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsId = useId();
  const productsRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  /* Condense the header once the hero has started to leave. A sentinel plus
     IntersectionObserver avoids a scroll listener firing on every frame. */
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:64px;pointer-events:none";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  /* Track whether a dark band is passing under the header. The observer's
     root is shrunk to the header's own strip at the top of the viewport, so
     it fires only while a band actually sits beneath the bar. */
  const [overDeep, setOverDeep] = useState(false);
  useEffect(() => {
    const bands = document.querySelectorAll("[data-surface='deep']");
    if (!bands.length) {
      setOverDeep(false);
      return;
    }
    const inside = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inside.add(entry.target);
          else inside.delete(entry.target);
        }
        setOverDeep(inside.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px", threshold: 0 },
    );
    bands.forEach((band) => observer.observe(band));
    return () => observer.disconnect();
  }, [path]);

  /* Close transient surfaces on route change. */
  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [path]);

  /* Escape closes whatever is open; a click outside closes the products panel. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setProductsOpen(false);
      setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!productsRef.current?.contains(event.target as Node))
        setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  /* The mobile sheet owns the scroll position while it is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /* Hover intent. Opening on the first pixel of contact made the panel flash
     open whenever the pointer merely crossed the nav on its way somewhere
     else; a short dwell first means it opens when you mean it. Closing keeps
     its grace period so a diagonal move into the panel does not drop it. */
  const openTimer = useRef<number | undefined>(undefined);
  const hoverOpen = () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setProductsOpen(true), 110);
  };
  const hoverClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 140);
  };

  /* One hover pill for the whole nav. It glides from link to link rather
     than each link lighting up on its own, and appears in place (no slide)
     when the pointer first arrives. */
  const navRef = useRef<HTMLElement>(null);
  const [glide, setGlide] = useState<{ x: number; w: number; fresh: boolean } | null>(null);
  const onNavOver = (event: React.MouseEvent) => {
    const nav = navRef.current;
    const link = (event.target as Element).closest<HTMLElement>(".hdr-link");
    if (!nav || !link || !nav.contains(link)) return;
    const a = nav.getBoundingClientRect();
    const b = link.getBoundingClientRect();
    setGlide((prev) => ({ x: b.left - a.left, w: b.width, fresh: prev === null }));
  };
  const onNavLeave = () => setGlide(null);

  /* A marker under the current section. It is measured after each route
     change and slides to the new link, so navigating shows where you went. */
  const [marker, setMarker] = useState<{ x: number; ready: boolean } | null>(null);
  useIsoLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const current = nav?.querySelector<HTMLElement>(".hdr-link[data-current]");
      if (!nav || !current) {
        setMarker(null);
        return;
      }
      const a = nav.getBoundingClientRect();
      const b = current.getBoundingClientRect();
      setMarker((prev) => ({ x: b.left - a.left + b.width / 2, ready: prev !== null }));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [path]);

  const isProduct = products.some((p) => path.startsWith(p.href));

  return (
    <header
      className="hdr"
      data-condensed={condensed}
      data-over={overDeep && !menuOpen ? "deep" : undefined}
    >
      <div className="hdr-in shell shell-wide">
        <a href="/" className="hdr-brand" aria-label="Zineps, home">
          <Logo />
        </a>

        <nav
          className="hdr-nav"
          aria-label="Primary"
          ref={navRef}
          onMouseOver={onNavOver}
          onMouseLeave={onNavLeave}
        >
          <span
            className="hdr-glide"
            aria-hidden="true"
            data-show={glide ? "" : undefined}
            data-fresh={glide?.fresh ? "" : undefined}
            style={
              glide
                ? ({ "--gx": `${glide.x}px`, "--gw": `${glide.w}px` } as React.CSSProperties)
                : undefined
            }
          />
          <span
            className="hdr-marker"
            aria-hidden="true"
            data-show={marker ? "" : undefined}
            data-ready={marker?.ready ? "" : undefined}
            style={marker ? ({ "--mx": `${marker.x}px` } as React.CSSProperties) : undefined}
          />
          <div
            className="hdr-products"
            ref={productsRef}
            onMouseEnter={hoverOpen}
            onMouseLeave={hoverClose}
          >
            <button
              type="button"
              className="hdr-link"
              aria-expanded={productsOpen}
              aria-controls={productsId}
              data-current={isProduct || undefined}
              onClick={() => setProductsOpen((open) => !open)}
            >
              Products
              <svg
                className="hdr-chev"
                width="9"
                height="6"
                viewBox="0 0 9 6"
                aria-hidden="true"
              >
                <path
                  d="M1 1.25 4.5 4.75 8 1.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div
              id={productsId}
              className="hdr-panel"
              data-open={productsOpen}
              role="group"
              aria-label="Products"
            >
              <div className="hdr-panel-in">
                {products.map((item) => (
                  <a key={item.href} href={item.href} className="hdr-card">
                    <span className="hdr-card-title">{item.title}</span>
                    <span className="hdr-card-blurb">{item.blurb}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hdr-link"
              data-current={path.startsWith(item.href) || undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hdr-end">
          <SearchButton />
          <ThemeToggle />
          <a href="/contact" className="hdr-link hdr-link-quiet">
            Talk to sales
          </a>
          <a href="/pricing" className="btn btn-primary hdr-cta">
            Start shipping
          </a>
          <button
            type="button"
            className="hdr-burger"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile sheet. Rendered always so the close transition can play. */}
      <div className="sheet" data-open={menuOpen} aria-hidden={!menuOpen}>
        <nav className="sheet-in" aria-label="Mobile">
          <p className="sheet-label">Products</p>
          {products.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="sheet-link"
              style={{ "--i": i } as React.CSSProperties}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.title}
            </a>
          ))}
          <hr className="rule sheet-rule" />
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="sheet-link"
              style={{ "--i": i + products.length } as React.CSSProperties}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </a>
          ))}
          <div className="sheet-actions">
            <a
              href="/pricing"
              className="btn btn-primary btn-lg"
              tabIndex={menuOpen ? 0 : -1}
            >
              Start shipping
            </a>
            <a
              href="/contact"
              className="btn btn-ghost btn-lg"
              tabIndex={menuOpen ? 0 : -1}
            >
              Talk to sales
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
