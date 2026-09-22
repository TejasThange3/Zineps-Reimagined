import { useCallback, useEffect, useState } from "react";

/**
 * A very small client router.
 *
 * Real anchors stay in the markup, so the site keeps working without
 * JavaScript-flavoured navigation quirks: middle-click, open-in-new-tab and
 * right-click all behave natively. We only intercept plain left clicks on
 * same-origin links and swap the view, using the View Transitions API where
 * the browser has it.
 */

export function normalisePath(path: string) {
  const clean = path.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.defaultPrevented
  );
}

export function useRoute(ssrPath?: string) {
  const [path, setPath] = useState(() =>
    normalisePath(
      typeof location === "undefined" ? (ssrPath ?? "/") : location.pathname,
    ),
  );

  const go = useCallback((next: string, replace = false) => {
    const target = normalisePath(next);
    if (target === normalisePath(location.pathname)) return;

    const swap = () => {
      if (replace) history.replaceState({}, "", target);
      else history.pushState({}, "", target);
      setPath(target);
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (doc.startViewTransition && !reduce) doc.startViewTransition(swap);
    else swap();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isPlainLeftClick(event)) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;

      event.preventDefault();
      if (url.hash) {
        // Same-page fragment on a different route: navigate, then scroll.
        go(url.pathname);
        requestAnimationFrame(() => {
          document
            .getElementById(decodeURIComponent(url.hash.slice(1)))
            ?.scrollIntoView({ behavior: "smooth" });
        });
        return;
      }
      go(url.pathname);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };

    const onPop = () => setPath(normalisePath(location.pathname));

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, [go]);

  return { path, go };
}
