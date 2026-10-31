import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "studiospace_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

export interface SessionUser {
  email: string
  name: string
  avatarUrl?: string
}

function getSecretKey() {
  const secret = process.env.JWT_SECRET ?? "studiospace-dev-secret-change-me"
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ name: user.name, avatarUrl: user.avatarUrl ?? "" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== "string" || typeof payload.name !== "string") {
      return null
    }
    return {
      email: payload.sub,
      name: payload.name,
      avatarUrl:
        typeof payload.avatarUrl === "string" && payload.avatarUrl
          ? payload.avatarUrl
          : undefined,
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
}
