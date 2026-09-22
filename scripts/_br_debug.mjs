/**
 * Prerender every route to static HTML.
 *
 * Each route gets its own file with its own title, description, social card
 * and, most importantly, its rendered markup. Without that the browser paints
 * an empty shell, React mounts a third of a second later, and the whole page
 * appears at once, which Chrome scores as a large layout shift and which
 * makes the largest paint wait on the JavaScript bundle.
 *
 * Article routes come from src/data/articles.ts rather than being repeated
 * here, so a new guide cannot end up without a page.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { transform } from "esbuild";

const SITE = "Zineps";

/** route -> [title, description] */
const pages = {
  "/": [
    "Zineps | Shipping infrastructure for e-commerce and logistics",
    "Zineps puts one dashboard and one API across 80+ carriers. Ship on rates negotiated by logistics partners, your own carrier contracts, or both.",
  ],
  "/shipping": [
    "Shipping software for online stores",
    "Orders arrive by themselves, rules pick the service, and labels come out ready to print. Shipping software for e-commerce and SMEs.",
  ],
  "/logistics-operating-system": [
    "The logistics operating system",
    "Publish rates, manage contracts, customer groups and margins, invoice automatically, and onboard the merchants you already serve.",
  ],
  "/shipping-ai": [
    "Shipping AI",
    "Delay prediction, smart routing, rate intelligence and cross-border compliance scored on your own lanes.",
  ],
  "/integrations": [
    "Integrations",
    "Connect your stores, marketplaces, warehouse software and 80+ carriers through one integration.",
  ],
  "/pricing": [
    "Pricing",
    "A platform fee plus a few cents a label, falling as you grow. Free for up to 200 shipments a month.",
  ],
  "/blog": [
    "Blog",
    "Packaging maths, rule sets, customs fields and return reasons. The decisions that set what shipping really costs.",
  ],
  "/knowledge-base": [
    "Knowledge base",
    "Setup, automation rules, returns, cross-border paperwork and the Zineps API reference.",
  ],
  "/contact": [
    "Contact",
    "Questions about rates, lanes, integrations or partnering. Zineps is based in Amsterdam.",
  ],
};

const source = await fs.readFile("src/data/articles.ts", "utf8");
const { code } = await transform(source, { loader: "ts", format: "esm" });
const articleModule = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);

for (const article of articleModule.articles) {
  pages[`/blog/${article.slug}`] = [article.title, article.standfirst];
}

const { render } = await import(
  pathToFileURL(path.resolve("dist/server/entry-server.js")).href
);

/* The latin subsets are the ones the site paints with. Preloading them means
   the metric-matched fallback is rarely seen at all. */
const fontFiles = (await fs.readdir("dist/assets")).filter((file) =>
  /^geist(-mono)?-latin-wght-normal-.*\.woff2$/.test(file),
);

const fontPreloads = fontFiles
  .map(
    (file) =>
      `    <link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  )
  .join("\n");

const template = await fs.readFile("dist/index.html", "utf8");

const escape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * React 19 hoists resource hints, such as the preload it generates for an
 * <img>, to the front of the rendered string. Left in place they end up
 * inside <div id="root">, where the client never puts them, and every page
 * fails to hydrate. Lift them into <head>, which is where they belong and
 * where they actually do some good.
 */
function liftResourceHints(markup) {
  const hints = [];
  let rest = markup;
  const leading = /^<(?:link|meta)[^>]*>/;
  let match;
  while ((match = rest.match(leading))) {
    hints.push(match[0]);
    rest = rest.slice(match[0].length);
  }
  return { hints, body: rest };
}

function shell(route, title, description) {
  const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`;
  const canonical = `<link rel="canonical" href="${escape(route)}" />`;
  const { hints, body } = liftResourceHints(render(route));
  if (route === "/knowledge-base") console.error("DEBUG hints", hints.length, JSON.stringify(body.slice(0,60)));
  const head = [
    fontPreloads,
    "    " + canonical,
    ...hints.map((hint) => "    " + hint),
  ].join("\n");

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(fullTitle)}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${escape(fullTitle)}$2`,
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${escape(description)}$2`,
    )
    .replace("</head>", `${head}\n  </head>`)
    // A function replacement keeps any $ sequences in the markup literal.
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

let written = 0;

for (const [route, [title, description]] of Object.entries(pages)) {
  const file =
    route === "/"
      ? "dist/index.html"
      : path.join("dist", route.slice(1), "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, shell(route, title, description));
  written++;
}

await fs.writeFile(
  "dist/404.html",
  shell("/404", "Page not found", "This page could not be found."),
);

/* Build artefacts, not things to serve. */
await fs.rm("dist/server", { recursive: true, force: true });
await fs.rm("dist/.vite", { recursive: true, force: true });

console.log(`Prerendered ${written} routes and a 404 fallback.`);
