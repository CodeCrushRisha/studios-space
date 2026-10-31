import { MongoClient, type Db } from "mongodb"

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? "studiospace"

interface CachedMongo {
  client: MongoClient
  db: Db
}

const globalWithMongo = global as typeof globalThis & {
  _mongo?: CachedMongo
}

/**
 * Returns the MongoDB database handle, or `null` when no `MONGODB_URI`
 * is configured so callers can fall back to local seed data.
 */
export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  if (!globalWithMongo._mongo) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    globalWithMongo._mongo = { client, db: client.db(MONGODB_DB_NAME) }
  }

  return globalWithMongo._mongo.db
}
