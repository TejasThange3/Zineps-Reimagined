import { optical } from "../lib/optical";

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="shell shell-wide notfound-in">
        {/* Decorative. The heading carries the message. */}
        <p className="notfound-code num" aria-hidden="true">
          404
        </p>
        <h1 style={optical("This one did not arrive.")}>
          This one did not arrive.
        </h1>
        <p className="lead">
          The page has moved, or the link was wrong. Tracking has its limits.
        </p>
        <div className="intro-actions">
          <a href="/" className="btn btn-primary btn-lg">
            Back to the start
          </a>
          <a href="/integrations" className="btn btn-ghost btn-lg">
            Browse integrations
          </a>
        </div>
      </div>
    </section>
  );
}
