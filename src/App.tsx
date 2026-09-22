import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useRoute } from "./lib/router";
import { Home } from "./pages/Home";
import Shipping from "./pages/Shipping";
import Partners from "./pages/Partners";
import ShippingAI from "./pages/ShippingAI";
import Integrations from "./pages/Integrations";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Knowledge from "./pages/Knowledge";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const titles: Record<string, string> = {
  "/": "Zineps | Shipping infrastructure for e-commerce and logistics",
  "/shipping": "Shipping software for online stores | Zineps",
  "/logistics-operating-system": "The logistics operating system | Zineps",
  "/shipping-ai": "Shipping AI | Zineps",
  "/integrations": "Integrations | Zineps",
  "/pricing": "Pricing | Zineps",
  "/blog": "Blog | Zineps",
  "/knowledge-base": "Knowledge base | Zineps",
  "/contact": "Contact | Zineps",
};

/**
 * Pages are imported directly rather than lazily.
 *
 * Every route is prerendered to real HTML at build time, so the markup is
 * already on screen before any JavaScript runs. Code splitting would only add
 * a second round trip and a Suspense fallback that is shorter than the page
 * it replaces, which showed up as a visible layout shift.
 */
function View({ path }: { path: string }) {
  if (path === "/") return <Home />;
  if (path === "/shipping") return <Shipping />;
  if (path === "/logistics-operating-system") return <Partners />;
  if (path === "/shipping-ai") return <ShippingAI />;
  if (path === "/integrations") return <Integrations />;
  if (path === "/pricing") return <Pricing />;
  if (path === "/blog") return <Blog />;
  if (path.startsWith("/blog/")) return <Article slug={path.slice(6)} />;
  if (path === "/knowledge-base") return <Knowledge />;
  if (path === "/contact") return <Contact />;
  return <NotFound />;
}

export default function App({ ssrPath }: { ssrPath?: string }) {
  const { path } = useRoute(ssrPath);

  useEffect(() => {
    const title = titles[path];
    // Article sets its own title from the guide it is showing.
    if (title) document.title = title;
  }, [path]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main">
        <View path={path} />
      </main>
      <Footer />
    </>
  );
}
