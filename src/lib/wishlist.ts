import type { Document } from "mongodb"
import { getDb } from "@/lib/mongodb"

interface WishlistDoc extends Document {
  _id: string
  studioIds: string[]
}

const globalForWishlists = globalThis as typeof globalThis & {
  __studiospaceWishlists?: Map<string, Set<string>>
}

const memoryWishlists =
  globalForWishlists.__studiospaceWishlists ??= new Map<
    string,
    Set<string>
  >()

export async function getWishlist(userEmail: string): Promise<string[]> {
  const db = await getDb()

  if (db) {
    try {
      const doc = await db
        .collection<WishlistDoc>("wishlists")
        .findOne({ _id: userEmail })
      return doc?.studioIds ?? []
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB query failed, using in-memory wishlist.",
        error
      )
    }
  }

  return [...(memoryWishlists.get(userEmail) ?? [])]
}

/**
 * Toggles a studio in the user's wishlist.
 * Returns `true` when the studio is now saved.
 */
export async function toggleWishlist(
  userEmail: string,
  studioId: string
): Promise<boolean> {
  const db = await getDb()

  if (db) {
    try {
      const collection = db.collection<WishlistDoc>("wishlists")
      const existing = await collection.findOne({ _id: userEmail })
      const isSaved = existing?.studioIds.includes(studioId) ?? false

      if (isSaved) {
        await collection.updateOne(
          { _id: userEmail },
          { $pull: { studioIds: studioId } as unknown as Document }
        )
        return false
      }

      await collection.updateOne(
        { _id: userEmail },
        { $addToSet: { studioIds: studioId } },
        { upsert: true }
      )
      return true
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB toggle failed, using in-memory wishlist.",
        error
      )
    }
  }

  const set = memoryWishlists.get(userEmail) ?? new Set<string>()
  if (set.has(studioId)) {
    set.delete(studioId)
    memoryWishlists.set(userEmail, set)
    return false
  }
  set.add(studioId)
  memoryWishlists.set(userEmail, set)
  return true
}
