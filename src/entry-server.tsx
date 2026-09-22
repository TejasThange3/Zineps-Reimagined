import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Build-time render. scripts/prerender.mjs calls this once per route and
 * writes the result into that route's HTML shell, so every page ships real
 * markup and the browser has something to paint before any script runs.
 */
export function render(path: string) {
  // The client hydrates inside StrictMode, so the server has to render inside
  // it too. useId numbers positions in the tree, and an extra wrapper on one
  // side alone is enough to make every generated id disagree.
  return renderToString(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  );
}
