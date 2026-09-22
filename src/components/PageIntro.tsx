import type { ReactNode } from "react";
import { Display } from "./Display";

/**
 * Shared page opening. One structure across every subpage keeps the rhythm
 * even, and keeps each page from inventing its own hero.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  actions,
  aside,
}: {
  eyebrow?: string;
  /** One entry per line. Breaks are deliberate so every line can be
   *  optically aligned; below the tablet breakpoint they reflow. */
  title: string[];
  lead: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="intro">
      <div className="intro-wash" aria-hidden="true" />
      <div className="shell shell-wide intro-in">
        <div className="intro-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <Display as="h1" lines={title} />
          <p className="lead">{lead}</p>
          {actions ? <div className="intro-actions">{actions}</div> : null}
        </div>
        {aside ? <div className="intro-aside">{aside}</div> : null}
      </div>
    </section>
  );
}
