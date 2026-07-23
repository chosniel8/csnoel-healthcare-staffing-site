import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { createContext } from "./_core/context";
import { publicSiteAssetProxy } from "./publicAssetProxy";
import { appRouter } from "./routers";

/**
 * Creates the request application used by both local development and Netlify
 * Functions. It intentionally owns no listener, filesystem server, or session
 * state so each function invocation stays stateless.
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/manus-storage/:key", (req, res) => {
    void publicSiteAssetProxy(req, res).catch(() => {
      if (!res.headersSent) res.status(502).json({ error: "The requested asset is temporarily unavailable." });
    });
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
