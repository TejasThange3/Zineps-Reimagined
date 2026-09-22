import { lazy, Suspense, useEffect, useState } from "react";
import { NetworkStats } from "./components/Statistics";
import { Hero } from "./components/Hero";
import { SiteHeader } from "./components/SiteHeader";
import {
  PlatformDoors,
  ReachSection,
  JournalPreview,
} from "./components/Editorial";
import { ShippingDemo } from "./components/ShippingDemo";
import { Journey } from "./components/Journey";
import {
  Audiences,
  Closing,
  FAQ,
  Integrations,
  ProofBand,
  Reassurance,
} from "./components/Sections";
const SubPage = lazy(async () => {
  const pages = await import("./pages");
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const routes: Record<string, () => React.JSX.Element> = {
    "/shipping": pages.ShippingPage,
    "/logistics-operating-system": pages.PartnerPage,
    "/shipping-ai": pages.AIPage,
    "/integrations": pages.IntegrationsPage,
    "/pricing": pages.PricingPage,
    "/blog": pages.BlogPage,
    "/knowledge-base": pages.KnowledgePage,
    "/contact": pages.ContactPage,
  };
  if (path.startsWith("/blog/"))
    return { default: () => <pages.ArticlePage slug={path.split("/")[2]} /> };
  return { default: routes[path] || pages.NotFound };
});
export default function App() {
  const [partner, setPartner] = useState(false);
  const isHome = window.location.pathname === "/";
  useEffect(() => {
    // Full document navigation keeps URLs, history and native link behavior intact.
    // Lazy destinations may mount after the browser's first fragment lookup.
    const update = () => {
      const heading = document.querySelector("h1");
      if (heading) document.title = `${heading.textContent} | Zineps concept`;
      let target: HTMLElement | null = null;
      try {
        target = document.getElementById(
          decodeURIComponent(location.hash.slice(1)),
        );
      } catch {
        /* Invalid fragments are ignored. */
      }
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
        return true;
      }
      return !!heading && !location.hash;
    };
    if (update()) return;
    const observer = new MutationObserver(() => {
      if (update()) observer.disconnect();
    });
    observer.observe(document.getElementById("main")!, {
      childList: true,
      subtree: true,
    });
    const timeout = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <SiteHeader />
      <main id="main">
        {isHome ? (
          <>
            <Hero />
            <ProofBand />
            <NetworkStats />
            <PlatformDoors />
            <ShippingDemo />
            <Journey />
            <Audiences partner={partner} setPartner={setPartner} />
            <Integrations />
            <ReachSection />
            <Reassurance />
            <JournalPreview />
            <FAQ />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                Preparing your destination…
              </div>
            }
          >
            <SubPage />
          </Suspense>
        )}
      </main>
      <Closing />
    </>
  );
}
