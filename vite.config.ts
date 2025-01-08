import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import adapter from "@hono/vite-dev-server/cloudflare";
import serverAdapter from "hono-react-router-adapter/vite";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: {
      external: ["cloudflare:workers"],
      input: isSsrBuild ? "./workers/app.ts" : undefined,
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
      externalConditions: ["workerd", "worker"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  plugins: [
    reactRouter(),
    serverAdapter({
      adapter,
      entry: "./workers/app.ts",
    }),
    tsconfigPaths(),
  ],
}));
