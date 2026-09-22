import { RateConsole } from "../RateConsole";
import { Display } from "../Display";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-wash" aria-hidden="true" />
      <div className="shell shell-wide hero-in">
        <div className="hero-copy">
          <Display
            as="h1"
            className="hero-title"
            lines={["Ship on contracts you", "could not negotiate alone."]}
          />
          <p className="hero-lead">
            Zineps puts one dashboard and one API across 80+ carriers. Use a
            partner&rsquo;s rates, your own contracts, or both.
          </p>
          <div className="hero-actions">
            <a href="/pricing" className="btn btn-primary btn-lg">
              Start shipping
            </a>
            <a
              href="/logistics-operating-system"
              className="btn btn-ghost btn-lg"
            >
              For logistics partners
            </a>
          </div>
        </div>

        <div className="hero-console">
          <RateConsole />
        </div>
      </div>
    </section>
  );
}
