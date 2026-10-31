import { createHash } from "node:crypto"
import { getDb } from "@/lib/mongodb"

export interface StoredUser {
  name: string
  email: string
  password: string
  photoUrl?: string
}

const SEED_USERS: StoredUser[] = [
  {
    name: "Examiner",
    email: "examiner@studiospace.test",
    password: "Studio123",
    photoUrl: "",
  },
]

const globalForUsers = globalThis as typeof globalThis & {
  __studiospaceUsers?: Map<string, StoredUser>
}

const memoryUsers =
  globalForUsers.__studiospaceUsers ??= new Map<string, StoredUser>()

for (const seed of SEED_USERS) {
  if (!memoryUsers.has(seed.email)) {
    memoryUsers.set(seed.email, seed)
  }
}

function hashPassword(password: string) {
  return createHash("sha256")
    .update(`studiospace:${password}`)
    .digest("hex")
}

/**
 * Password policy: at least one uppercase letter, one lowercase letter,
 * and a minimum length of 6 characters. Returns an error message or null.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long."
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter."
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter."
  }
  return null
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ name: string; email: string; photoUrl?: string } | null> {
  const stored = await findUser(email)
  if (!stored) return null
  const valid =
    stored.password === `sha256:${hashPassword(password)}` ||
    stored.password === password
  if (!valid) return null
  return {
    name: stored.name,
    email: stored.email,
    photoUrl: stored.photoUrl || undefined,
  }
}

async function findUser(email: string): Promise<StoredUser | null> {
  const db = await getDb()
  if (db) {
    try {
      const doc = await db
        .collection<StoredUser & { _id: unknown }>("users")
        .findOne({ email })
      if (doc) return doc
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB user lookup failed, using in-memory users.",
        error
      )
    }
  }
  return memoryUsers.get(email) ?? null
}

export type RegisterResult =
  | { ok: true; user: { name: string; email: string; photoUrl?: string } }
  | { ok: false; error: string }

export async function createUser(input: {
  name: string
  email: string
  password: string
  photoUrl?: string
}): Promise<RegisterResult> {
  const policyError = validatePassword(input.password)
  if (policyError) return { ok: false, error: policyError }

  const existing = await findUser(input.email)
  if (existing) {
    return { ok: false, error: "An account with this email already exists." }
  }

  const user: StoredUser = {
    name: input.name,
    email: input.email,
    password: `sha256:${hashPassword(input.password)}`,
    photoUrl: input.photoUrl ?? "",
  }

  const db = await getDb()
  if (db) {
    try {
      await db.collection("users").insertOne({ ...user })
    } catch (error) {
      console.warn(
        "StudioSpace: MongoDB user insert failed, using in-memory users.",
        error
      )
      memoryUsers.set(user.email, user)
    }
  } else {
    memoryUsers.set(user.email, user)
  }

  return {
    ok: true,
    user: {
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl || undefined,
    },
  }
}

/**
 * Ensures the demo Google account exists and returns its profile.
 * Used by the Google social login flow (no real OAuth secrets required).
 */
export async function ensureGoogleUser(): Promise<{
  name: string
  email: string
  photoUrl?: string
}> {
  const email = "google.demo@gmail.com"
  const existing = await findUser(email)
  if (existing) {
    return {
      name: existing.name,
      email: existing.email,
      photoUrl: existing.photoUrl || undefined,
    }
  }
  await createUser({
    name: "Google Demo User",
    email,
    password: "GoogleDemo1",
  })
  return { name: "Google Demo User", email }
}
