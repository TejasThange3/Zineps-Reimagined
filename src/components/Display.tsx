import { optical } from "../lib/optical";

/**
 * A display heading whose every line is optically aligned, not just the first.
 *
 * One correction on the heading only reaches its opening line, so a heading
 * that breaks into three still shows three different left edges: Geist gives
 * a capital F a 9/1000em bearing and a lowercase t 55/1000em, which is four
 * pixels of visible rag at 48px. The eye reads the ink, not the box, so the
 * block looks crooked even though the layout is exact.
 *
 * Setting each line in its own block lets every one carry its own correction,
 * so all the left edges land on the column. Where a line is still too long
 * for the viewport it wraps inside its own block, which keeps the break
 * points deliberate instead of leaving them to the measure.
 */
export function Display({
  as: Tag = "h2",
  lines,
  className,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  lines: string[];
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={className} id={id}>
      {lines.map((line, i) => (
        <span
          key={line}
          className="display-line"
          style={optical(line)}
          // Keeps the whole heading as one readable string for assistive
          // tech rather than a list of fragments.
          aria-hidden={undefined}
        >
          {line}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
