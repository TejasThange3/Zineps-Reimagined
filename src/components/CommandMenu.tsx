import { useEffect, useId, useMemo, useRef, useState } from "react";
import { integrations } from "../data/integrations";
import { articles } from "../data/articles";
import { Mark } from "./Mark";

/**
 * ⌘K: every page, integration, guide and help section, one keystroke away.
 *
 * Opened by ⌘K / Ctrl+K, by "/" outside a text field, or by any component
 * that dispatches the `zineps:command` event (the header search button, the
 * knowledge-base panel). It is a real combobox for assistive tech: the input
 * owns focus, arrow keys move the active option, Enter opens it, Escape
 * closes and hands focus back to wherever it came from.
 *
 * The open is almost instant on purpose. A palette is used in quick bursts,
 * and an entrance you wait through on the fifth use is a tax, not polish.
 */

type Entry = {
  id: string;
  group: "Pages" | "Integrations" | "Guides" | "Help";
  title: string;
  hint: string;
  href: string;
  keywords: string;
  mark?: Parameters<typeof Mark>[0]["id"];
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const PAGES: Entry[] = [
  ["Home", "/", "rates console lanes carriers"],
  ["Shipping software", "/shipping", "labels rules tracking returns stores"],
  ["For logistics partners", "/logistics-operating-system", "carriers 3pl margins invoicing"],
  ["Shipping AI", "/shipping-ai", "delay risk prediction carrier performance"],
  ["Integrations", "/integrations", "connect stores marketplaces carriers"],
  ["Pricing", "/pricing", "plans cost estimator free"],
  ["Blog", "/blog", "guides articles journal"],
  ["Knowledge base", "/knowledge-base", "docs help setup api"],
  ["Contact", "/contact", "sales talk demo"],
].map(([title, href, keywords]) => ({
  id: `page-${href}`,
  group: "Pages" as const,
  title,
  hint: href === "/" ? "zineps" : href.slice(1).replace(/-/g, " "),
  href,
  keywords,
}));

const HELP: Entry[] = [
  ["start", "Getting started", "account sender address first label"],
  ["orders", "Orders and labels", "import bulk print scan and go"],
  ["rules", "Automation rules", "conditions defaults testing"],
  ["returns", "Returns and tracking", "portal approval notifications"],
  ["cross-border", "Cross-border", "customs incoterms vat hold"],
  ["api", "API reference", "developers endpoints webhooks"],
].map(([id, title, keywords]) => ({
  id: `help-${id}`,
  group: "Help" as const,
  title,
  hint: "Knowledge base",
  href: `/knowledge-base#${id}`,
  keywords,
}));

const ENTRIES: Entry[] = [
  ...PAGES,
  ...articles.map((a) => ({
    id: `guide-${a.slug}`,
    group: "Guides" as const,
    title: a.title,
    hint: `${a.topic} · ${a.minutes} min`,
    href: `/blog/${a.slug}`,
    keywords: `${a.topic} ${a.standfirst}`,
  })),
  ...HELP,
  ...integrations.map((i) => ({
    id: `int-${slugify(i.name)}`,
    group: "Integrations" as const,
    title: i.name,
    hint: i.category,
    href: `/integrations#int-${slugify(i.name)}`,
    keywords: `${i.category} ${i.blurb}`,
    mark: i.mark,
  })),
];

const ORDER: Entry["group"][] = ["Pages", "Guides", "Help", "Integrations"];

/** Word starts beat substrings; title beats keywords. */
function score(entry: Entry, q: string) {
  const title = entry.title.toLowerCase();
  if (title.startsWith(q)) return 4;
  if (title.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (title.includes(q)) return 2;
  if (entry.keywords.toLowerCase().includes(q)) return 1;
  return 0;
}

export function openCommandMenu() {
  window.dispatchEvent(new Event("zineps:command"));
}

export function CommandMenu({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? ENTRIES.map((e) => ({ e, s: score(e, q) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .map((x) => x.e)
      : ENTRIES.filter((e) => e.group !== "Integrations");
    // Grouped in a fixed order, capped so one group cannot drown the rest.
    return ORDER.flatMap((g) => pool.filter((e) => e.group === g).slice(0, q ? 6 : 9));
  }, [query]);

  /* Open and close from anywhere. */
  useEffect(() => {
    const show = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement | null)?.closest(
        "input, textarea, select, [contenteditable]",
      );
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((o) => {
          if (!o) returnTo.current = document.activeElement as HTMLElement | null;
          return !o;
        });
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("zineps:command", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("zineps:command", show);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Focus in on open, back out on close; the page does not scroll behind. */
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => input.current?.focus());
    } else {
      document.body.style.overflow = "";
      returnTo.current?.focus?.();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  /* Keep the active option in view while arrowing through a long list. */
  useEffect(() => {
    list.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (entry: Entry | undefined) => {
    if (!entry) return;
    setOpen(false);
    onNavigate(entry.href);
  };

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      // Focus stays in the palette while it is open.
      event.preventDefault();
    }
  };

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="cmdk" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search the site">
        <div className="cmdk-field">
          <span className="cmdk-glass" aria-hidden="true" />
          <input
            ref={input}
            className="cmdk-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            placeholder="Search pages, integrations, guides…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmdk-esc">esc</kbd>
        </div>

        <ul className="cmdk-list" id={listId} role="listbox" ref={list} aria-label="Results">
          {results.length === 0 ? (
            <li className="cmdk-empty" role="presentation">
              Nothing matches <b>{query.trim()}</b>. Try a carrier, a store or a
              question.
            </li>
          ) : (
            results.map((entry, i) => {
              const head = entry.group !== lastGroup;
              lastGroup = entry.group;
              return (
                <li key={entry.id} role="presentation">
                  {head ? (
                    <p className="cmdk-group mono" aria-hidden="true">
                      {entry.group}
                    </p>
                  ) : null}
                  <div
                    id={`${listId}-${entry.id}`}
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    className="cmdk-item"
                    onPointerMove={() => i !== active && setActive(i)}
                    onClick={() => choose(entry)}
                  >
                    <span className="cmdk-icon" aria-hidden="true">
                      {entry.mark ? (
                        <Mark id={entry.mark} name="" base={16} />
                      ) : (
                        <span className={`cmdk-glyph cmdk-glyph-${entry.group.toLowerCase()}`} />
                      )}
                    </span>
                    <span className="cmdk-title">{entry.title}</span>
                    <span className="cmdk-hint mono">{entry.hint}</span>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className="cmdk-foot mono" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
