import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import type { IncomingMessage, ServerResponse } from "http";
import { createContext } from "../../server/_core/context.js";
import { appRouter } from "../../server/routers.js";

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
  basePath: "/api/trpc/",
});

export default function trpcHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
