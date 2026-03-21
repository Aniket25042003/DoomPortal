import "server-only";

import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Get the current session in a server component or server action.
 * Tries auth.api.getSession first, then falls back to fetching
 * the session endpoint directly (workaround for Vercel deployment
 * where getSession can return null despite valid cookies).
 */
export async function getServerSession() {
  const reqHeaders = await headers();

  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (session) return session;

  const cookie = reqHeaders.get("cookie");
  if (!cookie) return null;

  try {
    const baseUrl =
      process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data?.session && data?.user) return data;
    return null;
  } catch {
    return null;
  }
}
