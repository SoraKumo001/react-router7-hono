import { reactRouter } from "@react-router/dev/vite";
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
    transformer: "lightningcss",
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
    tailwindcss(),
    reactRouter(),
    serverAdapter({
      adapter,
      entry,
    }),
    tsconfigPaths(),
  ],
}));
