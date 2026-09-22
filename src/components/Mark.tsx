import ratios from "../data/marks.json";

export type MarkId = keyof typeof ratios;

/**
 * A partner logo in the vendor's own colours.
 *
 * Height is optical rather than fixed. Sizing every mark to the same height
 * makes a square badge look roughly twice the weight of a wide wordmark, so
 * the height falls away with the aspect ratio: h = base / ratio^0.34. A 1:1
 * badge keeps the full height, a 4:1 wordmark drops to about 62% of it, and a
 * 6.7:1 lockup to about 53%. That is close to equal perceived area without
 * shrinking long marks into illegibility.
 *
 * Most of these marks are dark by design: UPS brown sits at 0.03 luminance,
 * bol navy at 0.05, FedEx purple at 0.16. On a dark page they vanish. Rather
 * than inverting them, which would throw away the colour that makes them
 * recognisable, dark mode sets each one on a light chip, exactly as a printed
 * partner wall would. `lift` records which marks actually need it, measured
 * from the artwork at build time.
 */
export function Mark({
  id,
  name,
  base = 30,
  className = "",
}: {
  id: MarkId;
  name: string;
  base?: number;
  className?: string;
}) {
  const entry = ratios[id];
  const ratio = entry?.ratio ?? 1;
  const height = base / Math.pow(ratio, 0.34);

  return (
    <img
      className={`mark ${className}`}
      data-lift={entry?.lift || undefined}
      src={`/assets/marks-colour/${id}.png`}
      alt={name}
      width={Math.round(height * ratio)}
      height={Math.round(height)}
      loading="lazy"
      decoding="async"
      style={
        {
          "--mark-h": `${height.toFixed(2)}px`,
          "--mark-w": `${(height * ratio).toFixed(2)}px`,
        } as React.CSSProperties
      }
    />
  );
}
