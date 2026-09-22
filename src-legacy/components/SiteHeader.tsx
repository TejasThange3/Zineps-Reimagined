import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { Logo, Modal, ExternalLink } from "./ui";
import { links } from "../data/content";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const products = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && products.current?.open) {
        products.current.open = false;
        products.current.querySelector("summary")?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        products.current?.open &&
        !products.current.contains(event.target as Node)
      )
        products.current.open = false;
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, []);
  const destinations = [
    ["Shipping software", "/shipping"],
    ["For logistics partners", "/logistics-operating-system"],
    ["Shipping AI", "/shipping-ai"],
    ["Integrations", "/integrations"],
    ["Pricing", "/pricing"],
    ["Journal", "/blog"],
    ["Knowledge base", "/knowledge-base"],
    ["Contact", "/contact"],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header site-header" id="top">
        <div className="container header-inner">
          <a href="/" aria-label="Zineps home">
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <details className="nav-products" ref={products}>
              <summary>
                Platform <ChevronDown size={14} />
              </summary>
              <div className="nav-popover">
                {destinations.slice(0, 3).map(([name, href], i) => (
                  <a key={href} href={href}>
                    <span className="mono">0{i + 1}</span>
                    <span>
                      {name}
                      <small>
                        {
                          [
                            "From checkout to doorstep",
                            "Your network. One workspace.",
                            "Make every option clearer",
                          ][i]
                        }
                      </small>
                    </span>
                    <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            </details>
            {destinations.slice(3, 7).map(([name, href]) => (
              <a
                href={href}
                key={href}
                aria-current={location.pathname === href ? "page" : undefined}
              >
                {name}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ExternalLink
              href={links.register}
              className="button mint header-cta"
              showIcon={false}
            >
              <span className="header-cta-label">Start Shipping</span>
            </ExternalLink>
            <button
              className="icon-button menu-button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              aria-expanded={open}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Explore Zineps"
        className="mobile-menu"
      >
        <nav aria-label="Mobile navigation">
          {destinations.map(([name, href]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </nav>
      </Modal>
    </>
  );
}
