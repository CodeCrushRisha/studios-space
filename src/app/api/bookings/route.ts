import { NextResponse } from "next/server"
import { createBooking, findConflictingBooking, getBookingsForUser } from "@/lib/bookings"
import { getSession } from "@/lib/session"
import { getStudioById } from "@/lib/studios"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { studioId?: string; startTime?: string; endTime?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const studioId = body.studioId?.trim()
  const startTime = body.startTime?.trim()
  const endTime = body.endTime?.trim()

  if (!studioId || !startTime || !endTime) {
    return NextResponse.json(
      { error: "studioId, startTime, and endTime are required" },
      { status: 400 }
    )
  }

  if (Number.isNaN(Date.parse(startTime)) || Number.isNaN(Date.parse(endTime))) {
    return NextResponse.json(
      { error: "startTime and endTime must be valid date-time strings" },
      { status: 400 }
    )
  }

  if (endTime <= startTime) {
    return NextResponse.json(
      { error: "endTime must be after startTime" },
      { status: 400 }
    )
  }

  const studio = await getStudioById(studioId)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const conflict = await findConflictingBooking(studioId, startTime, endTime)
  if (conflict) {
    return NextResponse.json(
      {
        error: `This time slot is already booked (${formatRange(
          conflict.startTime,
          conflict.endTime
        )}). Please choose different hours.`,
        conflict: {
          startTime: conflict.startTime,
          endTime: conflict.endTime,
        },
      },
      { status: 409 }
    )
  }

  const booking = await createBooking({
    studioId,
    studioName: studio.name,
    userEmail: session.email,
    startTime,
    endTime,
    hourlyRate: studio.hourlyRate,
  })

  return NextResponse.json({ booking }, { status: 201 })
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookings = await getBookingsForUser(session.email)
  return NextResponse.json({ bookings })
}

function formatRange(startTime: string, endTime: string) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const startTimeLabel = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
  const endTimeLabel = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
  return `${date}, ${startTimeLabel} – ${endTimeLabel}`
}
