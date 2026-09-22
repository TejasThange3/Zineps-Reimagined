// A development SSR server, purely so React's non-minified hydration
// diagnostics are available while debugging mismatches.
import { createServer } from "vite";
import http from "node:http";
import fs from "node:fs/promises";

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

const server = http.createServer((req, res) => {
  vite.middlewares(req, res, async () => {
    try {
      const url = req.url.split("?")[0];
      let template = await fs.readFile("index.html", "utf8");
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const html = template.replace(
        '<div id="root"></div>',
        `<div id="root">${render(url.replace(/\/$/, "") || "/")}</div>`,
      );
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      res.statusCode = 500;
      res.end(String(error.stack));
    }
  });
});

server.listen(5199, () => console.log("ssr dev on http://127.0.0.1:5199"));
