import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import type { IncomingMessage, ServerResponse } from "http";
import { createContext } from "../../server/_core/context";
import { appRouter } from "../../server/routers";

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

export default function trpcHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
