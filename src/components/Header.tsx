import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

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

  const hoverOpen = () => {
    window.clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const hoverClose = () => {
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 140);
  };

  const isProduct = products.some((p) => path.startsWith(p.href));

  return (
    <header className="hdr" data-condensed={condensed}>
      <div className="hdr-in shell shell-wide">
        <a href="/" className="hdr-brand" aria-label="Zineps, home">
          <Logo />
        </a>

        <nav className="hdr-nav" aria-label="Primary">
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
