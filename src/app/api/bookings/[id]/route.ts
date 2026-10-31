import { NextResponse } from "next/server"
import { cancelBooking } from "@/lib/bookings"
import { getSession } from "@/lib/session"

/**
 * PATCH /api/bookings/[id] — cancels the caller's Pending booking.
 */
export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const result = await cancelBooking(id, session.email)

  switch (result) {
    case "cancelled":
      return NextResponse.json({ success: true, status: "Cancelled" })
    case "forbidden":
      return NextResponse.json(
        { error: "This booking belongs to another account" },
        { status: 403 }
      )
    case "not_pending":
      return NextResponse.json(
        { error: "Only Pending bookings can be cancelled" },
        { status: 409 }
      )
    default:
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
  }
}
