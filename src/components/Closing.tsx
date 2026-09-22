/**
 * Closing call to action. One intent, one label, matching the header and
 * footer so the site never asks for the same thing three different ways.
 */
import { optical } from "../lib/optical";

export function Closing({
  title = "Put your next parcel on a better contract.",
  body = "Connect a store, compare what the network can do for your lanes, and print a label. The free plan needs no card.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="closing">
      <div className="shell shell-wide closing-in">
        <div className="closing-copy">
          <h2 style={optical(title)}>{title}</h2>
          <p className="lead">{body}</p>
        </div>
        <div className="closing-actions">
          <a href="/pricing" className="btn btn-primary btn-lg">
            Start shipping
          </a>
          <a href="/contact" className="btn btn-ghost btn-lg">
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
