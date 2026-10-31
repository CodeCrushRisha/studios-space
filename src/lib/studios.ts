import { ObjectId, type Document } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { categoryLabelFor } from "@/lib/studio-categories"

export { amenityOptions, studioCategories, categoryLabelFor } from "@/lib/studio-categories"

export interface StudioReview {
  author: string
  rating: number
  comment: string
  date: string
}

export interface Studio {
  id: string
  name: string
  category: string
  categoryLabel: string
  imageUrl: string
  images: string[]
  hourlyRate: number
  securityDeposit: number
  maxCapacity: number
  amenities: string[]
  overview: string
  rating: number
  reviewCount: number
  location: string
  ownerEmail?: string
  ownerName?: string
  reviews: StudioReview[]
}

interface StudioDoc extends Document {
  name: string
  category: string
  categoryLabel?: string
  imageUrl: string
  images?: string[]
  hourlyRate: number
  securityDeposit?: number
  maxCapacity?: number
  amenities?: string[]
  overview?: string
  rating: number
  reviewCount?: number
  location: string
  ownerEmail?: string
  ownerName?: string
  reviews?: StudioReview[]
  createdAt?: Date
}

const seedStudios: Studio[] = [
  {
    id: "luminous-photo-loft",
    name: "Luminous Photo Loft",
    category: "photo",
    categoryLabel: "Photo Studio",
    imageUrl: "/images/studios/studio-1.jpg",
    images: ["/images/studios/studio-1.jpg", "/images/categories/photo.jpg"],
    hourlyRate: 65,
    securityDeposit: 130,
    maxCapacity: 12,
    amenities: ["Wi-Fi", "Natural Light", "Cyclorama", "Makeup Area", "Restroom"],
    overview:
      "A sun-drenched loft with 14-foot windows, a white cyclorama, and a full grip corner. Shoot stills and video from morning golden hour to late afternoon.",
    rating: 4.9,
    reviewCount: 248,
    location: "Brooklyn, NY",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Maya Chen",
        rating: 5,
        comment:
          "The natural light here is unreal. Cyclorama was spotless and the grip gear saved our shoot day.",
        date: "2026-09-14",
      },
      {
        author: "Jordan Blake",
        rating: 5,
        comment:
          "Plenty of space for a 10-person crew, fast Wi-Fi, and easy load-in.",
        date: "2026-08-02",
      },
    ],
  },
  {
    id: "silverline-sound-stage",
    name: "Silverline Sound Stage",
    category: "sound-stage",
    categoryLabel: "Film Stage",
    imageUrl: "/images/studios/studio-2.jpg",
    images: [
      "/images/studios/studio-2.jpg",
      "/images/categories/sound-stage.jpg",
    ],
    hourlyRate: 150,
    securityDeposit: 500,
    maxCapacity: 40,
    amenities: ["Wi-Fi", "Parking", "Green Screen", "Lighting Kit", "Blackout Blinds"],
    overview:
      "A 4,000 sq ft sound stage with a 24-foot lighting grid, green screen wall, and drive-in access. Built for commercials, narrative film, and music videos.",
    rating: 4.9,
    reviewCount: 132,
    location: "Atlanta, GA",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Priya Nair",
        rating: 5,
        comment:
          "Grid and dimmers worked perfectly. The stage crew addon was worth every dollar.",
        date: "2026-07-21",
      },
      {
        author: "Marcus Hill",
        rating: 4,
        comment:
          "Huge space and quiet. Load-in could be smoother, but the stage itself is top tier.",
        date: "2026-06-11",
      },
    ],
  },
  {
    id: "the-mic-room",
    name: "The Mic Room",
    category: "podcast",
    categoryLabel: "Podcast Lounge",
    imageUrl: "/images/studios/studio-3.jpg",
    images: [
      "/images/studios/studio-3.jpg",
      "/images/categories/podcast.jpg",
    ],
    hourlyRate: 40,
    securityDeposit: 80,
    maxCapacity: 6,
    amenities: ["Wi-Fi", "Audio Gear", "Kitchen", "Restroom", "Blackout Blinds"],
    overview:
      "An acoustically treated podcast lounge with four Shure SM7B mics, a RØDECaster Pro II, and a cozy set that looks great on camera.",
    rating: 4.9,
    reviewCount: 311,
    location: "Austin, TX",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Dani Ortega",
        rating: 5,
        comment:
          "Walked in, plugged in, pressed record. Cleanest podcast setup in the city.",
        date: "2026-10-01",
      },
      {
        author: "Sam Whitfield",
        rating: 5,
        comment:
          "Acoustic treatment is excellent — zero room echo on the recordings.",
        date: "2026-09-05",
      },
    ],
  },
  {
    id: "golden-hour-studio",
    name: "Golden Hour Studio",
    category: "photo",
    categoryLabel: "Photo Studio",
    imageUrl: "/images/studios/studio-4.jpg",
    images: ["/images/studios/studio-4.jpg", "/images/categories/photo.jpg"],
    hourlyRate: 85,
    securityDeposit: 170,
    maxCapacity: 15,
    amenities: ["Wi-Fi", "Parking", "Natural Light", "Makeup Area", "Restroom"],
    overview:
      "A daylight studio with a 30-foot seamless wall, C-stands, and a private glam room. Popular with fashion and portrait photographers.",
    rating: 4.8,
    reviewCount: 187,
    location: "Los Angeles, CA",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Riley Quinn",
        rating: 5,
        comment:
          "Booked for a lookbook shoot — the team loved the glam room and wardrobe rack.",
        date: "2026-08-30",
      },
      {
        author: "Alexis Ford",
        rating: 4,
        comment:
          "Great light all afternoon. Parking gets busy, but the studio itself is fantastic.",
        date: "2026-07-15",
      },
    ],
  },
  {
    id: "clay-and-canvas-workshop",
    name: "Clay & Canvas Workshop",
    category: "art",
    categoryLabel: "Workshop",
    imageUrl: "/images/studios/studio-5.jpg",
    images: ["/images/studios/studio-5.jpg", "/images/categories/art.jpg"],
    hourlyRate: 55,
    securityDeposit: 100,
    maxCapacity: 20,
    amenities: ["Wi-Fi", "Kitchen", "Restroom", "Wheelchair Access", "Natural Light"],
    overview:
      "A hands-on workshop space with sink stations, easels, and kiln access. Perfect for painting classes, ceramics sessions, and craft pop-ups.",
    rating: 4.8,
    reviewCount: 96,
    location: "Portland, OR",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Nora Bennett",
        rating: 5,
        comment:
          "Hosted a 14-person ceramics class — the sink stations and wheel access made it easy.",
        date: "2026-09-19",
      },
      {
        author: "Theo Marsh",
        rating: 5,
        comment:
          "Bright, clean, and the kiln worked flawlessly. Booking again next month.",
        date: "2026-08-24",
      },
    ],
  },
  {
    id: "echo-chamber-records",
    name: "Echo Chamber Records",
    category: "music",
    categoryLabel: "Music Suite",
    imageUrl: "/images/studios/studio-6.jpg",
    images: ["/images/studios/studio-6.jpg", "/images/categories/music.jpg"],
    hourlyRate: 75,
    securityDeposit: 200,
    maxCapacity: 10,
    amenities: ["Wi-Fi", "Parking", "Audio Gear", "Kitchen", "Restroom"],
    overview:
      "A tracking room and live room with an isolated vocal booth, vintage outboard gear, and an in-house engineer available on request.",
    rating: 4.7,
    reviewCount: 154,
    location: "Nashville, TN",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Cole Bennett",
        rating: 5,
        comment:
          "Tracked a full EP here. The vocal booth is dead quiet and the console sounds huge.",
        date: "2026-09-28",
      },
      {
        author: "Ivy Santos",
        rating: 4,
        comment:
          "Great gear and friendly staff. Bring your own cables if you have preferences.",
        date: "2026-08-17",
      },
    ],
  },
  {
    id: "north-loop-stage",
    name: "North Loop Stage",
    category: "sound-stage",
    categoryLabel: "Film Stage",
    imageUrl: "/images/studios/studio-2.jpg",
    images: [
      "/images/studios/studio-2.jpg",
      "/images/categories/sound-stage.jpg",
    ],
    hourlyRate: 120,
    securityDeposit: 350,
    maxCapacity: 30,
    amenities: ["Wi-Fi", "Parking", "Green Screen", "Lighting Kit"],
    overview:
      "A mid-size stage with a pre-lit cyc wall, catwalk access, and adjacent production office. Ideal for interviews and episodic content.",
    rating: 4.6,
    reviewCount: 74,
    location: "Chicago, IL",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Elena Brooks",
        rating: 5,
        comment:
          "Production office next door made our two-day interview shoot painless.",
        date: "2026-07-30",
      },
      {
        author: "Grant Miller",
        rating: 4,
        comment:
          "Solid stage. The catwalk access is a big plus for rigging.",
        date: "2026-06-20",
      },
    ],
  },
  {
    id: "riverside-podcast-suite",
    name: "Riverside Podcast Suite",
    category: "podcast",
    categoryLabel: "Podcast Lounge",
    imageUrl: "/images/studios/studio-3.jpg",
    images: [
      "/images/studios/studio-3.jpg",
      "/images/categories/podcast.jpg",
    ],
    hourlyRate: 45,
    securityDeposit: 90,
    maxCapacity: 8,
    amenities: ["Wi-Fi", "Audio Gear", "Restroom", "Blackout Blinds"],
    overview:
      "A river-facing podcast suite with a five-seat roundtable set, dual-camera support, and an interface preset for quick sessions.",
    rating: 4.5,
    reviewCount: 63,
    location: "Seattle, WA",
    ownerName: "StudioSpace Partner",
    ownerEmail: "partners@studiospace.test",
    reviews: [
      {
        author: "Harper Lee",
        rating: 5,
        comment:
          "Five of us recorded around the table with zero hassle. Great view too.",
        date: "2026-09-09",
      },
      {
        author: "Owen Park",
        rating: 4,
        comment:
          "Comfortable set and good mics. Room could use more outlet locations.",
        date: "2026-07-26",
      },
    ],
  },
]

function toStudio(doc: StudioDoc): Studio {
  return {
    id: String(doc._id),
    name: doc.name,
    category: doc.category,
    categoryLabel: doc.categoryLabel ?? categoryLabelFor(doc.category),
    imageUrl: doc.imageUrl,
    images: doc.images?.length ? doc.images : [doc.imageUrl],
    hourlyRate: doc.hourlyRate,
    securityDeposit: doc.securityDeposit ?? 0,
    maxCapacity: doc.maxCapacity ?? 0,
    amenities: doc.amenities ?? [],
    overview: doc.overview ?? "",
    rating: doc.rating,
    reviewCount: doc.reviewCount ?? 0,
    location: doc.location,
    ownerEmail: doc.ownerEmail,
    ownerName: doc.ownerName,
    reviews: doc.reviews ?? [],
  }
}

const globalForStudios = globalThis as typeof globalThis & {
  __studiospaceStudios?: Map<string, Studio>
}

const memoryStudios =
  globalForStudios.__studiospaceStudios ??= new Map<string, Studio>()

/**
 * Fills defaults on in-memory studios created before newer fields
 * (gallery, amenities, deposit, …) were introduced.
 */
function normalizeMemoryStudio(studio: Studio): Studio {
  return {
    ...studio,
    images: studio.images?.length ? studio.images : [studio.imageUrl],
    amenities: studio.amenities ?? [],
    overview: studio.overview ?? "",
    securityDeposit: studio.securityDeposit ?? 0,
    maxCapacity: studio.maxCapacity ?? 0,
    reviews: studio.reviews ?? [],
  }
}

function memoryStudiosSorted() {
  return [...memoryStudios.values()]
    .map(normalizeMemoryStudio)
    .sort((a, b) => b.rating - a.rating)
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

/** Returns every studio owned by the given user (My Studio Listings). */
export async function getStudiosByOwner(ownerEmail: string): Promise<Studio[]> {
  const db = await getDb()

  if (db) {
    try {
      const docs = await db
        .collection<StudioDoc>("studios")
        .find<StudioDoc>({ ownerEmail })
        .sort({ createdAt: -1 })
        .toArray()
      if (docs.length > 0) {
        return docs.map(toStudio)
      }
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB owner query failed, using in-memory studios.",
        error
      )
    }
  }

  return [...memoryStudios.values()]
    .filter((studio) => studio.ownerEmail === ownerEmail)
    .map(normalizeMemoryStudio)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export interface StudioInput {
  name: string
  category: string
  hourlyRate: number
  securityDeposit: number
  maxCapacity: number
  location: string
  imageUrl: string
  images: string[]
  amenities: string[]
  overview: string
}

export interface CreateStudioInput extends StudioInput {
  ownerEmail: string
  ownerName?: string
}

export async function createStudio(input: CreateStudioInput): Promise<Studio> {
  const db = await getDb()
  const doc = {
    ...input,
    categoryLabel: categoryLabelFor(input.category),
    rating: 0,
    reviewCount: 0,
    reviews: [],
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
    images: doc.images.length ? doc.images : [input.imageUrl],
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
  if (memoryStudio) return normalizeMemoryStudio(memoryStudio)

  const db = await getDb()
  if (db) {
    try {
      const doc = await db
        .collection<StudioDoc>("studios")
        .findOne(studioIdFilter(id))
      if (doc) return toStudio(doc)
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, falling back to seed studios.",
        error
      )
    }
  }

  return seedStudios.find((studio) => studio.id === id) ?? null
}

export type UpdateStudioResult =
  | { ok: true; studio: Studio }
  | { ok: false; reason: "not_found" | "forbidden" }

/**
 * Updates a studio document after verifying the caller owns it.
 * Writes to MongoDB when available, otherwise to the in-memory store.
 */
export async function updateStudio(
  id: string,
  ownerEmail: string,
  input: StudioInput
): Promise<UpdateStudioResult> {
  const existing = await getStudioById(id)
  if (!existing) return { ok: false, reason: "not_found" }
  if (existing.ownerEmail !== ownerEmail) {
    return { ok: false, reason: "forbidden" }
  }

  const patch: StudioInput & { categoryLabel: string } = {
    ...input,
    categoryLabel: categoryLabelFor(input.category),
    images: input.images.length ? input.images : [input.imageUrl],
  }

  const db = await getDb()
  if (db) {
    try {
      const result = await db
        .collection<StudioDoc>("studios")
        .updateOne(studioIdFilter(id), { $set: patch })
      if (result.matchedCount > 0) {
        const updated = await getStudioById(id)
        if (updated) return { ok: true, studio: updated }
      }
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB update failed, using in-memory studios.",
        error
      )
    }
  }

  const memoryStudio = memoryStudios.get(id)
  if (memoryStudio) {
    const updated: Studio = { ...memoryStudio, ...patch }
    memoryStudios.set(id, updated)
    return { ok: true, studio: updated }
  }

  return { ok: false, reason: "not_found" }
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
