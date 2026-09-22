import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/chrome.css";
import "./styles/hero.css";
import "./styles/console.css";
import "./styles/code.css";
import "./styles/sections.css";
import "./styles/home.css";
import "./styles/pages.css";
import "./styles/panels.css";
import "./styles/editorial.css";
import "./styles/effects.css";
import "./styles/journal.css";
import App from "./App";

const root = document.getElementById("root")!;
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Every route ships prerendered markup, so the usual path is hydration. The
// createRoot branch covers the dev server, where nothing is prerendered.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
