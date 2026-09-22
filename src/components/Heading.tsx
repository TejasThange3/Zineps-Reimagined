import type { ReactNode } from "react";
import { optical } from "../lib/optical";

/**
 * A display heading with its first line optically aligned.
 *
 * Takes the plain text so the first glyph can be measured, and renders
 * `children` when the heading needs markup inside it. Keeping the two
 * separate means the alignment never depends on walking a React tree.
 */
export function Heading({
  as: Tag = "h2",
  text,
  children,
  className,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  text: string;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={className} id={id} style={optical(text)}>
      {children ?? text}
    </Tag>
  );
}
