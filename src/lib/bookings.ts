import { ObjectId, type Document } from "mongodb"
import { getDb } from "@/lib/mongodb"

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"

export interface Booking {
  id: string
  studioId: string
  studioName: string
  userEmail: string
  startTime: string
  endTime: string
  status: BookingStatus
  hourlyRate: number
  createdAt: string
}

interface BookingDoc extends Document {
  studioId: string
  studioName: string
  userEmail: string
  startTime: string
  endTime: string
  status: BookingStatus
  hourlyRate: number
  createdAt: Date
}

const globalForBookings = globalThis as typeof globalThis & {
  __studiospaceBookings?: Map<string, Booking>
}

const memoryBookings =
  globalForBookings.__studiospaceBookings ??= new Map<string, Booking>()

function toBooking(doc: BookingDoc & { _id: unknown }): Booking {
  return {
    id: String(doc._id),
    studioId: doc.studioId,
    studioName: doc.studioName,
    userEmail: doc.userEmail,
    startTime: doc.startTime,
    endTime: doc.endTime,
    status: doc.status,
    hourlyRate: doc.hourlyRate,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
  }
}

function overlaps(startTime: string, endTime: string, booking: Booking) {
  return booking.startTime < endTime && booking.endTime > startTime
}

/**
 * Returns the first active (Pending/Confirmed) booking that overlaps the
 * given time range. Uses MongoDB range operators ($lt / $gt) when available.
 */
export async function findConflictingBooking(
  studioId: string,
  startTime: string,
  endTime: string
): Promise<Booking | null> {
  const db = await getDb()

  if (db) {
    try {
      const conflict = await db
        .collection<BookingDoc>("bookings")
        .findOne({
          studioId,
          status: { $in: ["Pending", "Confirmed"] },
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        })
      return conflict ? toBooking(conflict) : null
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB conflict check failed, using in-memory bookings.",
        error
      )
    }
  }

  for (const booking of memoryBookings.values()) {
    if (
      booking.studioId === studioId &&
      (booking.status === "Pending" || booking.status === "Confirmed") &&
      overlaps(startTime, endTime, booking)
    ) {
      return booking
    }
  }
  return null
}

export interface CreateBookingInput {
  studioId: string
  studioName: string
  userEmail: string
  startTime: string
  endTime: string
  hourlyRate: number
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const db = await getDb()
  const doc = { ...input, status: "Pending" as const, createdAt: new Date() }

  if (db) {
    try {
      const result = await db.collection<BookingDoc>("bookings").insertOne(doc)
      return toBooking({ ...doc, _id: result.insertedId })
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB insert failed, using in-memory bookings.",
        error
      )
    }
  }

  const booking: Booking = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: doc.createdAt.toISOString(),
  }
  memoryBookings.set(booking.id, booking)
  return booking
}

export async function getBookingsForUser(userEmail: string): Promise<Booking[]> {
  const db = await getDb()

  if (db) {
    try {
      const docs = await db
        .collection<BookingDoc>("bookings")
        .find({ userEmail })
        .sort({ createdAt: -1 })
        .toArray()
      return docs.map(toBooking)
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, using in-memory bookings.",
        error
      )
    }
  }

  return [...memoryBookings.values()]
    .filter((booking) => booking.userEmail === userEmail)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function isObjectIdHex(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

function bookingIdFilter(id: string): Document {
  return {
    $or: [{ _id: id }, ...(isObjectIdHex(id) ? [{ _id: new ObjectId(id) }] : [])],
  }
}

export type CancelBookingResult =
  | "cancelled"
  | "not_found"
  | "forbidden"
  | "not_pending"

/**
 * Cancels a booking the caller owns. Only Pending bookings can be cancelled.
 */
export async function cancelBooking(
  id: string,
  userEmail: string
): Promise<CancelBookingResult> {
  const memoryBooking = memoryBookings.get(id)
  if (memoryBooking) {
    if (memoryBooking.userEmail !== userEmail) return "forbidden"
    if (memoryBooking.status !== "Pending") return "not_pending"
    memoryBooking.status = "Cancelled"
    memoryBookings.set(id, memoryBooking)
    return "cancelled"
  }

  const db = await getDb()
  if (db) {
    try {
      const collection = db.collection<BookingDoc>("bookings")
      const doc = await collection.findOne(bookingIdFilter(id))
      if (!doc) return "not_found"
      if (doc.userEmail !== userEmail) return "forbidden"
      if (doc.status !== "Pending") return "not_pending"
      await collection.updateOne(
        bookingIdFilter(id),
        { $set: { status: "Cancelled" } }
      )
      return "cancelled"
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB cancel failed, using in-memory bookings.",
        error
      )
    }
  }

  return "not_found"
}
