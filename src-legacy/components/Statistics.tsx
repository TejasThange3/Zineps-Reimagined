const outcomes = [
  ["40%", "Shipping cost savings", "15+ hours saved on manual work per week."],
  [
    "98%",
    "Customer satisfaction increase",
    "Through faster delivery and better tracking.",
  ],
  [
    "65%",
    "Operational efficiency increase",
    "With 90% fewer errors through automation.",
  ],
  ["3x", "Faster growth", "With automated shipping and smart integrations."],
];
export function OutcomeStats() {
  return (
    <section className="section outcome-section">
      <div className="container">
        <div className="eyebrow section-eyebrow">
          WHAT MERCHANTS & PARTNERS GET
        </div>
        <h2>
          More time. <span className="muted-heading">More possibility.</span>
        </h2>
        <div className="outcome-grid">
          {outcomes.map(([value, label, detail]) => (
            <div key={label}>
              <strong>{value}</strong>
              <h3>{label}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
        <p className="source-note">
          Results reported by{" "}
          <a
            href="https://www.zineps.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zineps
          </a>
          . Individual results vary.
        </p>
      </div>
    </section>
  );
}
export function NetworkStats() {
  return (
    <section className="section network-stats">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow section-eyebrow">
              PARTNER SHIPPING RATES
            </div>
            <h2>
              Their buying power.
              <br />
              <span className="muted-heading">Your next advantage.</span>
            </h2>
          </div>
          <p>
            Access the rates negotiated by logistics partners. Bring your own
            contracts, use the partner network, or combine both.
          </p>
        </div>
        <div className="network-numbers">
          {[
            ["20+", "Shipping partners"],
            ["200+", "Destination countries"],
            ["1,000+", "Shipping methods"],
            ["100+", "Integrations"],
          ].map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <div className="performance-grid">
          <div className="analytics-card">
            <span className="mono">ANALYTICS</span>
            <strong>
              12,847 <small>+1,234</small>
            </strong>
            <svg
              viewBox="0 0 600 150"
              role="img"
              aria-label="Illustrative analytics trend, matching the original Zineps dashboard"
            >
              <defs>
                <linearGradient id="chart-fill" x2="0" y2="1">
                  <stop stopColor="#78cbb0" stopOpacity=".35" />
                  <stop offset="1" stopColor="#78cbb0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 130 80 110 160 115 240 45 320 95 400 80 480 35 600 10V150H0Z"
                fill="url(#chart-fill)"
              />
              <path
                d="M0 130 80 110 160 115 240 45 320 95 400 80 480 35 600 10"
                fill="none"
                stroke="#39856d"
                strokeWidth="3"
              />
            </svg>
            <span className="source-note">
              750 · Dashboard illustration from the original website
            </span>
          </div>
          <div className="reliability-card">
            <span className="mono">BUILT FOR CONTINUITY</span>
            <strong>
              99.9%<small>uptime</small>
            </strong>
            <p>Enterprise-grade reliability, with room to grow.</p>
            <div className="uptime-bars" aria-hidden="true">
              {Array.from({ length: 40 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
        </div>
        <p className="source-note">
          Network figures and uptime claim from{" "}
          <a
            href="https://www.zineps.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zineps
          </a>
          . Analytics values reproduce its illustrative dashboard.
        </p>
      </div>
    </section>
  );
}
export function PartnerStats() {
  return (
    <div className="container partner-statistics">
      <div className="network-numbers">
        {[
          ["1,000+", "Active shippers"],
          ["100+", "Carrier & logistics integrations"],
          ["5M+", "Shipments processed"],
        ].map(([n, l]) => (
          <div key={l}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="partner-gains">
        {[
          ["+55%", "Operational efficiency"],
          ["Real-time", "Revenue insights"],
          ["+40%", "Support efficiency"],
          ["10x faster", "Integration speed"],
        ].map(([n, l]) => (
          <div key={l}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <p className="source-note">
        Figures reported by{" "}
        <a href="https://www.zineps.com/logistics-operating-system">
          Zineps’s partner platform
        </a>
        .
      </p>
    </div>
  );
}
