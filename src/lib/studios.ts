import { ObjectId, type Document } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { categoryLabelFor } from "@/lib/studio-categories"

export { studioCategories, categoryLabelFor } from "@/lib/studio-categories"

export interface Studio {
  id: string
  name: string
  category: string
  categoryLabel: string
  imageUrl: string
  hourlyRate: number
  rating: number
  reviewCount: number
  location: string
  ownerEmail?: string
}

interface StudioDoc extends Document {
  name: string
  category: string
  categoryLabel?: string
  imageUrl: string
  hourlyRate: number
  rating: number
  reviewCount?: number
  location: string
  ownerEmail?: string
  createdAt?: Date
}

const seedStudios: Studio[] = [
  {
    id: "luminous-photo-loft",
    name: "Luminous Photo Loft",
    category: "photo",
    categoryLabel: "Photo Studios",
    imageUrl: "/images/studios/studio-1.jpg",
    hourlyRate: 65,
    rating: 4.9,
    reviewCount: 248,
    location: "Brooklyn, NY",
  },
  {
    id: "silverline-sound-stage",
    name: "Silverline Sound Stage",
    category: "sound-stage",
    categoryLabel: "Sound Stages",
    imageUrl: "/images/studios/studio-2.jpg",
    hourlyRate: 150,
    rating: 4.9,
    reviewCount: 132,
    location: "Atlanta, GA",
  },
  {
    id: "the-mic-room",
    name: "The Mic Room",
    category: "podcast",
    categoryLabel: "Podcast Rooms",
    imageUrl: "/images/studios/studio-3.jpg",
    hourlyRate: 40,
    rating: 4.9,
    reviewCount: 311,
    location: "Austin, TX",
  },
  {
    id: "golden-hour-studio",
    name: "Golden Hour Studio",
    category: "photo",
    categoryLabel: "Photo Studios",
    imageUrl: "/images/studios/studio-4.jpg",
    hourlyRate: 85,
    rating: 4.8,
    reviewCount: 187,
    location: "Los Angeles, CA",
  },
  {
    id: "clay-and-canvas-workshop",
    name: "Clay & Canvas Workshop",
    category: "art",
    categoryLabel: "Art Workshops",
    imageUrl: "/images/studios/studio-5.jpg",
    hourlyRate: 55,
    rating: 4.8,
    reviewCount: 96,
    location: "Portland, OR",
  },
  {
    id: "echo-chamber-records",
    name: "Echo Chamber Records",
    category: "music",
    categoryLabel: "Music Suites",
    imageUrl: "/images/studios/studio-6.jpg",
    hourlyRate: 75,
    rating: 4.7,
    reviewCount: 154,
    location: "Nashville, TN",
  },
  {
    id: "north-loop-stage",
    name: "North Loop Stage",
    category: "sound-stage",
    categoryLabel: "Sound Stages",
    imageUrl: "/images/studios/studio-2.jpg",
    hourlyRate: 120,
    rating: 4.6,
    reviewCount: 74,
    location: "Chicago, IL",
  },
  {
    id: "riverside-podcast-suite",
    name: "Riverside Podcast Suite",
    category: "podcast",
    categoryLabel: "Podcast Rooms",
    imageUrl: "/images/studios/studio-3.jpg",
    hourlyRate: 45,
    rating: 4.5,
    reviewCount: 63,
    location: "Seattle, WA",
  },
]

function toStudio(doc: StudioDoc): Studio {
  return {
    id: String(doc._id),
    name: doc.name,
    category: doc.category,
    categoryLabel: doc.categoryLabel ?? categoryLabelFor(doc.category),
    imageUrl: doc.imageUrl,
    hourlyRate: doc.hourlyRate,
    rating: doc.rating,
    reviewCount: doc.reviewCount ?? 0,
    location: doc.location,
    ownerEmail: doc.ownerEmail,
  }
}

const globalForStudios = globalThis as typeof globalThis & {
  __studiospaceStudios?: Map<string, Studio>
}

const memoryStudios =
  globalForStudios.__studiospaceStudios ??= new Map<string, Studio>()

function memoryStudiosSorted() {
  return [...memoryStudios.values()].sort((a, b) => b.rating - a.rating)
}

/**
 * Fetches every studio from MongoDB, newest/top-rated first.
 * Falls back to local seed data when `MONGODB_URI` is not configured
 * or the collection is empty, so search and listings always work.
 */
export async function getStudios(): Promise<Studio[]> {
  const db = await getDb()

  if (db) {
    try {
      const docs = await db
        .collection<StudioDoc>("studios")
        .find<StudioDoc>({})
        .sort({ rating: -1, createdAt: -1 })
        .toArray()

      if (docs.length > 0) {
        return docs.map(toStudio)
      }
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, falling back to seed studios.",
        error
      )
    }
  }

  return [...memoryStudiosSorted(), ...seedStudios].sort(
    (a, b) => b.rating - a.rating
  )
}

/**
 * Fetches the 6 top-rated (or newest) studios from MongoDB.
 * Falls back to local seed data when `MONGODB_URI` is not configured
 * or the collection is empty, so the home page always renders.
 */
export async function getFeaturedStudios(): Promise<Studio[]> {
  const db = await getDb()

  if (db) {
    try {
      const docs = await db
        .collection<StudioDoc>("studios")
        .find<StudioDoc>({})
        .sort({ rating: -1, createdAt: -1 })
        .limit(6)
        .toArray()

      if (docs.length > 0) {
        return docs.map(toStudio)
      }
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, falling back to seed studios.",
        error
      )
    }
  }

  return [...memoryStudiosSorted(), ...seedStudios]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
}

export interface CreateStudioInput {
  name: string
  category: string
  hourlyRate: number
  location: string
  imageUrl: string
  ownerEmail: string
}

export async function createStudio(input: CreateStudioInput): Promise<Studio> {
  const db = await getDb()
  const doc = {
    ...input,
    categoryLabel: categoryLabelFor(input.category),
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
  }

  if (db) {
    try {
      const result = await db.collection<StudioDoc>("studios").insertOne(doc)
      return toStudio({ ...doc, _id: result.insertedId })
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB insert failed, using in-memory studios.",
        error
      )
    }
  }

  const studio: Studio = {
    ...doc,
    id: crypto.randomUUID(),
  }
  memoryStudios.set(studio.id, studio)
  return studio
}

function isObjectIdHex(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

function studioIdFilter(id: string): Document {
  return {
    $or: [{ _id: id }, ...(isObjectIdHex(id) ? [{ _id: new ObjectId(id) }] : [])],
  }
}

export async function getStudioById(
  id: string
): Promise<Studio | null> {
  const memoryStudio = memoryStudios.get(id)
  if (memoryStudio) return memoryStudio

  const db = await getDb()
  if (db) {
    try {
      const doc = await db
        .collection<StudioDoc>("studios")
        .findOne(studioIdFilter(id))
      return doc ? toStudio(doc) : null
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, falling back to seed studios.",
        error
      )
    }
  }

  return seedStudios.find((studio) => studio.id === id) ?? null
}

export async function deleteStudio(
  id: string
): Promise<"deleted" | "not_found"> {
  if (memoryStudios.delete(id)) return "deleted"

  const db = await getDb()
  if (db) {
    try {
      const result = await db
        .collection<StudioDoc>("studios")
        .deleteOne(studioIdFilter(id))
      return result.deletedCount > 0 ? "deleted" : "not_found"
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB delete failed, studio not found.",
        error
      )
    }
  }

  return "not_found"
}
