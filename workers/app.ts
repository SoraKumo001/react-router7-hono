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
  const result = await handler(c.req.raw, { env: "abc" });
  return result;
});

export default app;
