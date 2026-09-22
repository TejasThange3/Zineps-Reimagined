import { useDeferredValue, useMemo, useState } from "react";
import { Display } from "../components/Display";
import { PageIntro } from "../components/PageIntro";
import { Segmented } from "../components/Segmented";
import { Faq } from "../components/Faq";
import { Closing } from "../components/Closing";
import { Mark } from "../components/Mark";
import { NumberTicker } from "../components/NumberTicker";
import {
  categories,
  integrations,
  integrationsFaq,
  type Category,
} from "../data/integrations";

type Filter = Category | "All";

export default function Integrations() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const results = useMemo(() => {
    const needle = deferred.trim().toLowerCase();
    return integrations.filter((item) => {
      if (filter !== "All" && item.category !== filter) return false;
      if (!needle) return true;
      return (
        item.name.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        item.blurb.toLowerCase().includes(needle)
      );
    });
  }, [filter, deferred]);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", integrations.length]]);
    for (const category of categories) {
      map.set(
        category,
        integrations.filter((i) => i.category === category).length,
      );
    }
    return map;
  }, []);

  return (
    <>
      <PageIntro
        title={["Keep the stack you have.", "Change what it costs to ship."]}
        lead="Connect your stores, marketplaces, warehouse software and carriers once. After that every order arrives in the same queue and every label comes out of the same workflow."
        actions={
          <>
            <a href="/pricing" className="btn btn-primary btn-lg">
              Start shipping
            </a>
            <a href="/contact" className="btn btn-ghost btn-lg">
              Request an integration
            </a>
          </>
        }
      />

      <section className="section-tight dir">
        <div className="shell shell-wide">
          <div className="dir-controls">
            {/* Segmented already carries role="group" and a label, so the
                wrapper only added a second identical group to the tree. */}
            <Segmented
              name="Category"
              value={filter}
              options={[
                { value: "All", label: `All ${counts.get("All")}` },
                ...categories.map((c) => ({
                  value: c,
                  label: `${c} ${counts.get(c)}`,
                })),
              ]}
              onChange={(value) => setFilter(value as Filter)}
            />

            <div className="dir-search">
              <label htmlFor="dir-q" className="sr">
                Search integrations
              </label>
              <input
                id="dir-q"
                type="search"
                className="input"
                placeholder="Search by name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <p className="dir-count" role="status" aria-live="polite">
            {results.length} of {integrations.length} shown
          </p>

          <p className="dir-reach">
            <NumberTicker value={80} suffix="+" /> carriers and{" "}
            <NumberTicker value={100} suffix="+" /> integrations behind one
            connection.
          </p>

          {results.length > 0 ? (
            <ul className="dir-grid">
              {results.map((item) => (
                <li key={item.name} className="dir-item">
                  <div className="dir-mark">
                    {item.mark ? (
                      <span className="chip">
                        <Mark id={item.mark} name={item.name} base={30} />
                      </span>
                    ) : (
                      <span className="dir-initial" aria-hidden="true">
                        {item.name.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <h2>{item.name}</h2>
                  <p>{item.blurb}</p>
                  <span className="dir-cat mono">{item.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dir-empty">
              <p>
                Nothing here matches <b>{query.trim()}</b>.
              </p>
              <p className="dir-empty-hint">
                Zineps builds missing connections for shops with the volume to
                justify them, usually inside a week.
              </p>
              <a href="/contact" className="btn btn-ghost">
                Ask for this one
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="section api-band">
        <div className="shell shell-wide api-band-in">
          <div>
            <Display
              lines={["Not on the list?", "Build it in an afternoon."]}
            />
            <p className="lead">
              The Zineps API covers rates, labels, tracking and returns for
              every carrier behind the platform, in one schema. If your system
              can post JSON, it can ship.
            </p>
          </div>
          <a href="/knowledge-base#api" className="btn btn-ghost btn-lg">
            Read the API reference
          </a>
        </div>
      </section>

      <Faq items={integrationsFaq} heading="Before you connect anything" />
      <Closing
        title="Connect a store and print a label today."
        body="The free plan carries 200 shipments a month with no per-label fee. Your carrier mix stays yours."
      />
    </>
  );
}
