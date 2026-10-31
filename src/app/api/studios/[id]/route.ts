import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { parseStudioBody } from "@/lib/studio-input"
import { deleteStudio, getStudioById, updateStudio } from "@/lib/studios"

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const parsed = await parseStudioBody(request)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = await updateStudio(id, session.email, parsed.input)
  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "You do not own this studio" },
      { status: 403 }
    )
  }

  return NextResponse.json({ studio: result.studio })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const studio = await getStudioById(id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  if (studio.ownerEmail && studio.ownerEmail !== session.email) {
    return NextResponse.json(
      { error: "You do not own this studio" },
      { status: 403 }
    )
  }

  const result = await deleteStudio(id)
  if (result === "not_found") {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
