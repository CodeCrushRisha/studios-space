import type { Document } from "mongodb"
import { getDb } from "@/lib/mongodb"

export interface Booking {
  id: string
  studioId: string
  studioName: string
  userEmail: string
  startTime: string
  endTime: string
  status: "Confirmed" | "Cancelled"
  hourlyRate: number
  createdAt: string
}

interface BookingDoc extends Document {
  studioId: string
  studioName: string
  userEmail: string
  startTime: string
  endTime: string
  status: "Confirmed" | "Cancelled"
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
 * Returns the first Confirmed booking that overlaps the given time range.
 * Uses MongoDB range operators ($lt / $gt) when a database is available.
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
          status: "Confirmed",
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
      booking.status === "Confirmed" &&
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
  const doc = { ...input, status: "Confirmed" as const, createdAt: new Date() }

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
