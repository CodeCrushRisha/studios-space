import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session"
import { verifyCredentials } from "@/lib/users"

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    )
  }
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 })
  }

  const user = await verifyCredentials(email, password)
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password. Please try again." },
      { status: 401 }
    )
  }

  const token = await createSessionToken(user)
  const response = NextResponse.json({ user }, { status: 200 })
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions)
  return response
}
