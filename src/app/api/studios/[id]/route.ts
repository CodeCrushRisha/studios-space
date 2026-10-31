import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { deleteStudio, getStudioById } from "@/lib/studios"

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
