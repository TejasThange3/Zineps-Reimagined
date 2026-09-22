/**
 * Cover art for the guides.
 *
 * Each one draws the idea the article is actually about rather than
 * decorating it: the gap between a box and what is in it, one order splitting
 * down a rule tree, a promised window against a real one, a parcel coming
 * back, four lanes of different weight, a form with a field left blank.
 *
 * Stock photography of a warehouse would say nothing and match nothing. These
 * are built from the same geometry as the rest of the site, take their colour
 * from the theme, and animate on hover without a single image request.
 */

const VB = "0 0 480 300";

function Frame({
  children,
  tone = 1,
}: {
  children: React.ReactNode;
  tone?: number;
}) {
  return (
    <svg
      className="cover-svg"
      viewBox={VB}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      data-tone={tone}
    >
      <rect className="cover-ground" width="480" height="300" />
      {children}
    </svg>
  );
}

/* The parcel is mostly air, and the carrier bills for the air. */
function DimensionalWeight() {
  return (
    <Frame tone={1}>
      <g className="cover-lines">
        <path d="M150 90 L290 90 L330 62 L190 62 Z" />
        <path d="M150 90 L150 218 L290 218 L290 90" />
        <path d="M290 218 L330 190 L330 62" />
        <path d="M150 90 L190 62" />
      </g>
      <g className="cover-fill">
        <rect x="196" y="160" width="52" height="42" rx="3" />
      </g>
      <g className="cover-ticks">
        <path d="M128 90 L128 218" />
        <path d="M122 90 L134 90" />
        <path d="M122 218 L134 218" />
        <path d="M150 238 L290 238" />
        <path d="M150 232 L150 244" />
        <path d="M290 232 L290 244" />
      </g>
      <text className="cover-num" x="112" y="158" textAnchor="end">
        30
      </text>
      <text className="cover-num" x="220" y="262" textAnchor="middle">
        40
      </text>
      <text className="cover-tag" x="222" y="152" textAnchor="middle">
        0.9 kg
      </text>
      <text className="cover-tag cover-tag-accent" x="366" y="128">
        billed 4.8
      </text>
      <path className="cover-hair" d="M340 122 L300 140" />
    </Frame>
  );
}

/* One order entering a rule tree and leaving by a chosen branch. */
function AutomationRules() {
  return (
    <Frame tone={2}>
      <g className="cover-lines">
        <path d="M70 150 L160 150" />
        <path d="M160 150 C205 150 205 84 250 84" />
        <path d="M160 150 C205 150 205 150 250 150" />
        <path d="M160 150 C205 150 205 216 250 216" />
      </g>
      <path className="cover-route" d="M160 150 C205 150 205 84 250 84" />
      <g className="cover-fill">
        <rect x="46" y="138" width="24" height="24" rx="3" />
      </g>
      <g className="cover-nodes">
        <circle cx="160" cy="150" r="5" />
      </g>
      <g className="cover-chips">
        <rect
          className="cover-chip-on"
          x="250"
          y="68"
          width="150"
          height="32"
          rx="6"
        />
        <rect x="250" y="134" width="130" height="32" rx="6" />
        <rect x="250" y="200" width="118" height="32" rx="6" />
      </g>
      <text className="cover-tag cover-tag-on" x="266" y="88">
        Routewise Standard
      </text>
      <text className="cover-tag" x="266" y="154">
        Pickup Point
      </text>
      <text className="cover-tag" x="266" y="220">
        Express
      </text>
    </Frame>
  );
}

/* A promised window laid over the one that actually happened. */
function DeliveryPromise() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <Frame tone={3}>
      <g className="cover-ticks">
        <path d="M60 196 L420 196" />
      </g>
      {days.map((d, i) => (
        <g key={i}>
          <path
            className="cover-ticks"
            d={`M${72 + i * 56} 190 L${72 + i * 56} 202`}
          />
          <text
            className="cover-num"
            x={72 + i * 56}
            y="222"
            textAnchor="middle"
          >
            {d}
          </text>
        </g>
      ))}
      <rect
        className="cover-band"
        x="72"
        y="120"
        width="112"
        height="46"
        rx="6"
      />
      <rect
        className="cover-band cover-band-late"
        x="72"
        y="120"
        width="224"
        height="46"
        rx="6"
      />
      <text className="cover-tag cover-tag-accent" x="84" y="110">
        promised
      </text>
      <text className="cover-tag" x="300" y="110">
        arrived
      </text>
      <g className="cover-nodes">
        <circle cx="184" cy="143" r="5" />
        <circle className="cover-node-late" cx="296" cy="143" r="5" />
      </g>
      <path className="cover-hair" d="M184 143 L296 143" />
    </Frame>
  );
}

/* The parcel going out, and the same parcel coming back. */
function Returns() {
  return (
    <Frame tone={2}>
      <g className="cover-lines">
        <path d="M90 108 C190 48 300 48 396 108" />
      </g>
      <path className="cover-route" d="M90 108 C190 48 300 48 396 108" />
      <path
        className="cover-route cover-route-back"
        d="M396 192 C300 252 190 252 90 192"
      />
      <g className="cover-fill">
        <rect x="62" y="96" width="28" height="28" rx="4" />
        <rect x="390" y="180" width="28" height="28" rx="4" />
      </g>
      <g className="cover-chips">
        <rect x="176" y="132" width="132" height="36" rx="18" />
      </g>
      <text
        className="cover-tag cover-tag-accent"
        x="242"
        y="154"
        textAnchor="middle"
      >
        approved automatically
      </text>
      <g className="cover-nodes">
        <circle cx="90" cy="108" r="4" />
        <circle cx="396" cy="108" r="4" />
        <circle cx="396" cy="192" r="4" />
        <circle cx="90" cy="192" r="4" />
      </g>
    </Frame>
  );
}

/* Four lanes of different weight, one of them carrying most of the volume. */
function CarrierMix() {
  const lanes = [
    { y: 84, w: 300, on: false },
    { y: 128, w: 372, on: true },
    { y: 172, w: 210, on: false },
    { y: 216, w: 148, on: false },
  ];
  return (
    <Frame tone={1}>
      {lanes.map((l, i) => (
        <g key={i}>
          <rect
            className="cover-track"
            x="70"
            y={l.y}
            width="340"
            height="10"
            rx="5"
          />
          <rect
            className={`cover-bar ${l.on ? "cover-bar-on" : ""}`}
            x="70"
            y={l.y}
            width={l.w}
            height="10"
            rx="5"
          />
          <circle
            className={`cover-cap ${l.on ? "cover-cap-on" : ""}`}
            cx={70 + l.w}
            cy={l.y + 5}
            r="6"
          />
        </g>
      ))}
      <text className="cover-tag" x="70" y="70">
        domestic
      </text>
      <text className="cover-tag cover-tag-accent" x="70" y="256">
        one carrier cannot be best at all four
      </text>
    </Frame>
  );
}

/* A customs form with one field left blank, which is where it stops. */
function CrossBorder() {
  const rows = [
    { label: "contents", w: 150, ok: true },
    { label: "hs code", w: 0, ok: false },
    { label: "value", w: 96, ok: true },
    { label: "incoterm", w: 72, ok: true },
  ];
  return (
    <Frame tone={3}>
      <rect
        className="cover-doc"
        x="118"
        y="52"
        width="244"
        height="212"
        rx="8"
      />
      <path className="cover-ticks" d="M142 88 L338 88" />
      {rows.map((r, i) => (
        <g key={r.label}>
          <text className="cover-tag" x="142" y={124 + i * 38}>
            {r.label}
          </text>
          {r.ok ? (
            <rect
              className="cover-field"
              x="226"
              y={112 + i * 38}
              width={r.w}
              height="12"
              rx="3"
            />
          ) : (
            <rect
              className="cover-field cover-field-empty"
              x="226"
              y={110 + i * 38}
              width="112"
              height="16"
              rx="3"
            />
          )}
        </g>
      ))}
      <g className="cover-stamp">
        <rect x="246" y="206" width="92" height="34" rx="4" />
        <text
          className="cover-tag cover-tag-stamp"
          x="292"
          y="228"
          textAnchor="middle"
        >
          HELD
        </text>
      </g>
    </Frame>
  );
}

const COVERS: Record<string, () => React.ReactElement> = {
  "dimensional-weight": DimensionalWeight,
  "automation-rules": AutomationRules,
  "delivery-promises": DeliveryPromise,
  "returns-that-do-not-cost": Returns,
  "carrier-mix": CarrierMix,
  "cross-border-holds": CrossBorder,
};

export function ArticleCover({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const Cover = COVERS[slug] ?? DimensionalWeight;
  return (
    <div className={`cover ${className}`}>
      <Cover />
    </div>
  );
}
