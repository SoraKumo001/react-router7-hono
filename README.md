# react-router-hono

## wrangler.toml

```toml
workers_dev = true
name = "react-router-hono"
compatibility_date = "2024-11-18"
compatibility_flags = ["nodejs_compat"]
main = "./build/server/index.js"
assets = { directory = "./build/client/" }

[vars]
TEST="Cloudflare Test"

[observability]
enabled = true
```

## vite.config.ts

```ts
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import adapter from "@hono/vite-dev-server/cloudflare";
import serverAdapter from "hono-remix-adapter/vite";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./workers/app.ts",
        }
      : undefined,
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
```

## app/routes.ts

```ts
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
```

## workers/app.ts

```ts
import { Hono } from "hono";
import { contextStorage, getContext } from "hono/context-storage";
import { createRequestHandler } from "react-router";

const app = new Hono();

app.use(contextStorage());

app.use(async (_c, next) => {
  if (!Object.getOwnPropertyDescriptor(process, "env")?.get) {
    const processEnv = process.env;
    Object.defineProperty(process, "env", {
      get() {
        try {
          return { ...processEnv, ...getContext().env };
        } catch {
          return processEnv;
        }
      },
    });
  }
  return next();
});

app.use(async (c) => {
  // @ts-expect-error - virtual module provided by React Router at build time
  const build = await import("virtual:react-router/server-build");
  const handler = createRequestHandler(build, import.meta.env.MODE);
  const result = await handler(c.req.raw);
  return result;
});

export default app;
```

## app/routes/\_index.tsx

```tsx
import { useLoaderData } from "react-router";

export default function Index() {
  const value = useLoaderData<string>();
  return <pre>{value}</pre>;
}

// At the point of module execution, process.env is available.

export const loader = () => {
  const value = JSON.stringify(process.env.TEST, null, 2);
  return value;
};
```
