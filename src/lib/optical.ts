import bearings from "../data/bearings.json";

/**
 * Optical alignment for display type.
 *
 * A glyph's left side bearing is the gap between its origin and where its ink
 * begins. In Geist that is 12/1000em for a capital T and 80/1000em for a
 * lowercase b, so a heading starting with T reads as sitting three pixels
 * right of the paragraph beneath it at 44px. The boxes are aligned; the ink
 * is not, and ink is what the eye measures.
 *
 * Pulling the first line back by the measured bearing puts the ink on the
 * column edge. It is computed during render, so the server and the client
 * produce the same markup and nothing moves after hydration.
 *
 * The shift is a negative margin rather than a text-indent. text-indent moves
 * only the first line of a block, so the moment an authored line is narrow
 * enough to wrap, the continuation snaps back to the untreated edge and the
 * heading rags by the width of the bearing. A margin moves the whole block,
 * so a wrap stays aligned with the line it came from.
 */
export function optical(text: string): React.CSSProperties | undefined {
  const first = text.trimStart().charAt(0);
  const bearing = (bearings as Record<string, number>)[first];
  if (!bearing) return undefined;
  return { marginLeft: `${-bearing}em` };
}

/**
 * The same thing for a heading built from JSX rather than a plain string.
 * Walks the tree for the first piece of text, which is the only place the
 * first glyph can come from.
 */
export function opticalNode(node: unknown): React.CSSProperties | undefined {
  const first = firstChar(node);
  return first ? optical(first) : undefined;
}

function firstChar(node: unknown): string {
  if (typeof node === "string") return node.trimStart().charAt(0);
  if (typeof node === "number") return String(node).charAt(0);
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = firstChar(child);
      if (found) return found;
    }
    return "";
  }
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return props ? firstChar(props.children) : "";
  }
  return "";
}
