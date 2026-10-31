import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getWishlist, toggleWishlist } from "@/lib/wishlist"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const studioIds = await getWishlist(session.email)
  return NextResponse.json({ studioIds })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { studioId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const studioId = body.studioId?.trim()
  if (!studioId) {
    return NextResponse.json({ error: "studioId is required" }, { status: 400 })
  }

  const saved = await toggleWishlist(session.email, studioId)
  return NextResponse.json({ studioId, saved })
}
