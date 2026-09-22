import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Display } from "./Display";

/**
 * Shared page building blocks.
 *
 * Each one is a distinct layout family, so a page can be composed without two
 * sections ever resolving to the same shape.
 */

/** A dense two-column list of capabilities, separated by hairlines. */
export function CapabilityList({
  title,
  lead,
  items,
}: {
  title: string[];
  lead?: ReactNode;
  items: { name: string; body: string }[];
}) {
  return (
    <section className="section caps">
      <div className="shell shell-wide">
        <div className="caps-head">
          <Display lines={title} />
          {lead ? <p className="lead">{lead}</p> : null}
        </div>
        <ul className="caps-grid">
          {items.map((item, i) => (
            <Reveal as="li" key={item.name} index={i % 4} shift={12}>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Problem and answer pairs, each carrying one figure. */
export function ProblemList({
  title,
  lead,
  items,
}: {
  title: string[];
  lead?: ReactNode;
  items: {
    name: string;
    problem: string;
    answer: string;
    figure: string;
    figureLabel: string;
  }[];
}) {
  return (
    <section className="section probs">
      <div className="shell shell-wide">
        <div className="caps-head">
          <Display lines={title} />
          {lead ? <p className="lead">{lead}</p> : null}
        </div>
        <ol className="probs-list">
          {items.map((item, i) => (
            <Reveal as="li" key={item.name} index={i} shift={14}>
              <div className="probs-name">
                <h3>{item.name}</h3>
              </div>
              <div className="probs-body">
                <p className="probs-problem">{item.problem}</p>
                <p className="probs-answer">{item.answer}</p>
              </div>
              <div className="probs-figure">
                <span className="num">{item.figure}</span>
                <span>{item.figureLabel}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A split of copy against an arbitrary visual, alternating side. */
export function SplitFeature({
  title,
  body,
  points,
  action,
  visual,
  flip = false,
  tinted = false,
}: {
  title: string[];
  body: ReactNode;
  points?: string[];
  action?: ReactNode;
  visual: ReactNode;
  flip?: boolean;
  tinted?: boolean;
}) {
  return (
    <section className={`section split ${tinted ? "split-tinted" : ""}`}>
      <div className="shell shell-wide">
        <div className="split-in" data-flip={flip || undefined}>
          <Reveal className="split-copy">
            <Display lines={title} />
            <p className="lead">{body}</p>
            {points ? (
              <ul className="intel-list">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {action}
          </Reveal>
          <Reveal className="split-visual" index={1} shift={22}>
            {visual}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A row of figures under a single statement. */
export function FigureRow({
  title,
  items,
  note,
}: {
  title: string[];
  items: { value: string; label: string }[];
  note?: string;
}) {
  return (
    <section className="section-tight figrow">
      <div className="shell shell-wide">
        <Display className="figrow-title" lines={title} />
        <ol className="figrow-list">
          {items.map((item, i) => (
            <Reveal as="li" key={item.label} index={i} shift={12}>
              <span className="figrow-value num">{item.value}</span>
              <span className="figrow-label">{item.label}</span>
            </Reveal>
          ))}
        </ol>
        {note ? <p className="figrow-note">{note}</p> : null}
      </div>
    </section>
  );
}
