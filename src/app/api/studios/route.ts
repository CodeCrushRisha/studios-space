import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { parseStudioBody } from "@/lib/studio-input"
import { createStudio } from "@/lib/studios"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = await parseStudioBody(request)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const studio = await createStudio({
    ...parsed.input,
    ownerEmail: session.email,
    ownerName: session.name,
  })

  return NextResponse.json({ studio }, { status: 201 })
}
