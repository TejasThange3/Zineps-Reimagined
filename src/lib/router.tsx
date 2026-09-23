import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

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

  /* Runs a view change inside a view transition. The new page has to be in
     the DOM, and scrolled, before the callback returns: the browser takes the
     "after" snapshot at that moment. A plain setState rendered a tick later,
     so the transition cross-faded the old page into itself and the new page
     then snapped in, and the scroll to top landed after it as a second jump. */
  const transition = useCallback((change: () => void) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduce) {
      change();
      return;
    }
    document.startViewTransition(() => flushSync(change));
  }, []);

  const go = useCallback(
    (next: string, replace = false, hash = "") => {
      const target = normalisePath(next);
      if (target === normalisePath(location.pathname) && !hash) return;

      transition(() => {
        if (replace) history.replaceState({}, "", target + hash);
        else history.pushState({}, "", target + hash);
        setPath(target);
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      });
    },
    [transition],
  );

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
        // Fragment on another route: navigate, then scroll to the fragment.
        go(url.pathname);
        requestAnimationFrame(() => {
          document
            .getElementById(decodeURIComponent(url.hash.slice(1)))
            ?.scrollIntoView({ behavior: "smooth" });
        });
        return;
      }
      go(url.pathname);
    };

    // Back and forward get the same transition as a click.
    const onPop = () =>
      transition(() => setPath(normalisePath(location.pathname)));

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, [go, transition]);

  return { path, go };
}
