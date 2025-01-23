import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import adapter from "@hono/vite-dev-server/cloudflare";
import serverAdapter from "hono-react-router-adapter/vite";

const entry = "./workers/app.ts";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: {
      input: isSsrBuild ? entry : undefined,
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
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
    tailwindcss(),
    serverAdapter({
      adapter,
      entry,
    }),
    tsconfigPaths(),
  ],
}));
