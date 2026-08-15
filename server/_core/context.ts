import { parse as parseCookie } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { COOKIE_NAME } from "@shared/const";
import * as db from "../db";
import { verifySession } from "./session";
import type { User } from "../../drizzle/schema";

export interface TrpcContext {
  req: IncomingMessage;
  res: ServerResponse;
  user: User | null;
}

export async function createContext({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<TrpcContext> {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const token = cookies[COOKIE_NAME];
  const session = token ? await verifySession(token) : null;
  const user = session ? ((await db.getUserByOpenId(session.openId)) ?? null) : null;
  return { req, res, user };
}
