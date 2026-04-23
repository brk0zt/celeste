import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { verifySessionToken } from "./session";
import { findUserById } from "../queries/users";
import type { User } from "@db/schema";

export async function authenticateRequest(headers: Headers): Promise<User | undefined> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  
  if (!token) {
    return undefined;
  }
  
  const claim = await verifySessionToken(token);
  if (!claim) {
    return undefined;
  }
  
  const user = await findUserById(claim.userId);
  if (!user) {
    return undefined;
  }
  
  return user;
}
