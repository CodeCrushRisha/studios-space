import { NextResponse } from "next/server"
import { createUser } from "@/lib/users"

export async function POST(request: Request) {
  let body: {
    name?: string
    email?: string
    password?: string
    photoUrl?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const photoUrl = body.photoUrl?.trim()

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    )
  }
  if (photoUrl && !/^https?:\/\//.test(photoUrl)) {
    return NextResponse.json(
      { error: "Photo URL must start with http:// or https://" },
      { status: 400 }
    )
  }

  const result = await createUser({ name, email, password: password ?? "", photoUrl })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // Registration does not sign the user in — they are sent to the Login page.
  return NextResponse.json({ success: true }, { status: 201 })
}
