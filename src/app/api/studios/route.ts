import { NextResponse } from "next/server"
import { studioCategories } from "@/lib/studio-categories"
import { getSession } from "@/lib/session"
import { createStudio } from "@/lib/studios"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: {
    name?: string
    category?: string
    hourlyRate?: number
    location?: string
    imageUrl?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const name = body.name?.trim()
  const category = body.category?.trim()
  const location = body.location?.trim()
  const hourlyRate = Number(body.hourlyRate)
  const imageUrl =
    body.imageUrl?.trim() ||
    `/images/studios/studio-${(Math.abs(hashCode(name ?? "s")) % 6) + 1}.jpg`

  if (!name || !category || !location || !Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    return NextResponse.json(
      {
        error:
          "name, category, location, and a positive hourlyRate are required",
      },
      { status: 400 }
    )
  }

  if (!studioCategories.some((c) => c.slug === category)) {
    return NextResponse.json(
      { error: `Unknown category "${category}"` },
      { status: 400 }
    )
  }

  const studio = await createStudio({
    name,
    category,
    hourlyRate,
    location,
    imageUrl,
    ownerEmail: session.email,
  })

  return NextResponse.json({ studio }, { status: 201 })
}

function hashCode(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return hash
}
