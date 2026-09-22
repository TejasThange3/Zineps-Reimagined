import { useState, type ReactNode } from "react";
import { Display } from "../Display";
import { Reveal } from "../Reveal";
import { Surface } from "../Surface";

/**
 * The developer argument. One integration replaces a shelf of carrier SDKs,
 * each with its own auth, its own label format and its own tracking webhook.
 *
 * The two tabs matter more than the code inside them: the shape of the
 * response is the actual promise, because it is identical whichever carrier
 * ends up moving the parcel. Tokens are marked up by hand rather than run
 * through a highlighter, which keeps the bundle free of a parser for two
 * fixed snippets.
 */

type Token = [string, string?];

/** A line is a list of [text, class] pairs. */
const REQUEST: Token[][] = [
  [
    ["POST", "m"],
    [" https://api.zineps.com/v1/shipments", "u"],
  ],
  [["Authorization:", "m"], [" Bearer "], ["$ZINEPS_KEY", "v"]],
  [],
  [["{", "p"]],
  [["  "], ['"reference"', "k"], [": ", "p"], ['"DEMO-0042"', "s"], [",", "p"]],
  [["  "], ['"to"', "k"], [": {", "p"]],
  [
    ["    "],
    ['"name"', "k"],
    [":     ", "p"],
    ['"Lotte Brandsma"', "s"],
    [",", "p"],
  ],
  [
    ["    "],
    ['"street"', "k"],
    [":   ", "p"],
    ['"Winsstraße 42"', "s"],
    [",", "p"],
  ],
  [["    "], ['"postcode"', "k"], [": ", "p"], ['"10405"', "s"], [",", "p"]],
  [["    "], ['"city"', "k"], [":     ", "p"], ['"Berlin"', "s"], [",", "p"]],
  [["    "], ['"country"', "k"], [":  ", "p"], ['"DE"', "s"]],
  [["  },", "p"]],
  [
    ["  "],
    ['"parcel"', "k"],
    [": { ", "p"],
    ['"weight"', "k"],
    [": ", "p"],
    ["2.0", "n"],
    [", ", "p"],
    ['"length"', "k"],
    [": ", "p"],
    ["30", "n"],
    [", ", "p"],
    ['"width"', "k"],
    [": ", "p"],
    ["20", "n"],
    [" }", "p"],
  ],
  [["  "], ['"prefer"', "k"], [": ", "p"], ['"balanced"', "s"]],
  [["}", "p"]],
];

const RESPONSE: Token[][] = [
  [
    ["201", "n"],
    [" Created", "m"],
  ],
  [],
  [["{", "p"]],
  [
    ["  "],
    ['"id"', "k"],
    [":        ", "p"],
    ['"shp_8Kq2vR"', "s"],
    [",", "p"],
  ],
  [
    ["  "],
    ['"service"', "k"],
    [":   ", "p"],
    ['"Routewise Standard"', "s"],
    [",", "p"],
  ],
  [
    ["  "],
    ['"partner"', "k"],
    [":   ", "p"],
    ['"Vinkveld Logistiek"', "s"],
    [",", "p"],
  ],
  [
    ["  "],
    ['"rate"', "k"],
    [":      { ", "p"],
    ['"amount"', "k"],
    [": ", "p"],
    ["7.90", "n"],
    [", ", "p"],
    ['"currency"', "k"],
    [": ", "p"],
    ['"EUR"', "s"],
    [" },", "p"],
  ],
  [
    ["  "],
    ['"transit"', "k"],
    [":   { ", "p"],
    ['"days"', "k"],
    [": ", "p"],
    ["2", "n"],
    [" },", "p"],
  ],
  [
    ["  "],
    ['"tracking"', "k"],
    [":  ", "p"],
    ['"3SZINEPS4820193"', "s"],
    [",", "p"],
  ],
  [
    ["  "],
    ['"label_url"', "k"],
    [": ", "p"],
    ['"…/labels/shp_8Kq2vR.pdf"', "s"],
  ],
  [["}", "p"]],
];

const tabs = [
  { id: "request", label: "Request", lines: REQUEST },
  { id: "response", label: "Response", lines: RESPONSE },
];

const points: [string, ReactNode][] = [
  [
    "Rates before you commit",
    "Quote every eligible service on the lane, then buy the one you want.",
  ],
  [
    "Labels as PDF or ZPL",
    "Print to a desktop printer or straight to a thermal label printer.",
  ],
  [
    "Webhooks on every event",
    "Collection, transit, delivery, exception and return, in one schema.",
  ],
];

export function Developers() {
  const [active, setActive] = useState("request");
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section className="section dev" id="developers">
      <div className="shell shell-wide">
        <div className="dev-grid">
          <Reveal className="dev-copy">
            <Display lines={["One integration,", "not eighty."]} />
            <p className="lead">
              Every carrier has its own authentication, its own label format and
              its own idea of what a tracking event looks like. Zineps
              normalises all of it.
            </p>

            <ul className="dev-points">
              {points.map(([title, body], i) => (
                <li key={title}>
                  <span className="dev-point-index num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <b>{title}</b>
                    <span>{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a href="/knowledge-base#api" className="btn btn-ghost">
              Read the API reference
            </a>
          </Reveal>

          <Reveal className="dev-window" index={1} shift={22}>
            <Surface beam className="dev-shell">
              <div className="dev-core">
                <div
                  className="dev-bar"
                  role="tablist"
                  aria-label="API example"
                >
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={item.id === active}
                      className="dev-tab"
                      onClick={() => setActive(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                  <span className="dev-bar-note mono">v1</span>
                </div>

                <pre className="dev-code" tabIndex={0}>
                  <code>
                    {tab.lines.map((line, i) => (
                      <span className="dev-line" key={i}>
                        <span className="dev-gutter" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="dev-text">
                          {line.length === 0
                            ? " "
                            : line.map(([text, cls], j) => (
                                <span key={j} className={cls ? `t-${cls}` : ""}>
                                  {text}
                                </span>
                              ))}
                        </span>
                      </span>
                    ))}
                  </code>
                </pre>

                <p className="dev-foot">
                  The same response shape for every carrier behind the platform.
                </p>
              </div>
            </Surface>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
