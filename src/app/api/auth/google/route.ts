import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session"
import { ensureGoogleUser } from "@/lib/users"

/**
 * Google social login.
 *
 * In this demo deployment no Google OAuth client secrets are configured, so
 * signing in with Google issues a session for a seeded Google demo account.
 * To wire real OAuth, exchange an authorization code against Google's token
 * endpoint here and map the returned profile to a session.
 */
export async function POST() {
  const user = await ensureGoogleUser()
  const token = await createSessionToken(user)
  const response = NextResponse.json({ user }, { status: 200 })
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions)
  return response
}
