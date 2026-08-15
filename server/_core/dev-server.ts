import "dotenv/config";
import express from "express";
import { createServer as createHttpServer } from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";

/**
 * Local-only dev entrypoint (npm run dev). Mounts the same tRPC router used by the
 * Vercel serverless function in api/trpc/[trpc].ts, with Vite in middleware mode
 * serving the client on the same port. Not deployed — Vercel builds client/ as a
 * static site and runs api/*.ts as separate functions instead.
 */
async function startServer() {
  const repoRoot = path.resolve(import.meta.dirname, "..", "..");
  const app = express();
  const httpServer = createHttpServer(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const vite = await createViteServer({
    root: path.resolve(repoRoot, "client"),
    server: { middlewareMode: true, hmr: { server: httpServer } },
  });
  app.use(vite.middlewares);

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, () => {
    console.log(`Dev server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
