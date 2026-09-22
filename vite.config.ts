import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // scripts/build-routes.mjs reads the manifest so each route shell can
    // preload its own page chunk. Without that the lazy page resolves after
    // first paint and the footer jumps down the viewport.
    manifest: true,
  },
});
