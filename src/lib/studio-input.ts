import { studioCategories } from "@/lib/studio-categories"
import type { StudioInput } from "@/lib/studios"

export type ParseStudioResult =
  | { ok: true; input: StudioInput }
  | { ok: false; error: string }

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Parses and validates the shared Add/Update Studio form payload.
 */
export async function parseStudioBody(
  request: Request
): Promise<ParseStudioResult> {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return { ok: false, error: "Invalid request body" }
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const category = typeof body.category === "string" ? body.category.trim() : ""
  const location =
    typeof body.location === "string" ? body.location.trim() : ""
  const overview =
    typeof body.overview === "string" ? body.overview.trim() : ""
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : ""

  if (!name) return { ok: false, error: "Title is required" }
  if (!studioCategories.some((c) => c.slug === category)) {
    return { ok: false, error: `Unknown category "${category}"` }
  }
  if (!location) return { ok: false, error: "Location/Address is required" }

  const hourlyRate = Number(body.hourlyRate)
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    return { ok: false, error: "Hourly Rate must be a positive number" }
  }

  const securityDepositRaw = Number(body.securityDeposit ?? 0)
  if (!Number.isFinite(securityDepositRaw) || securityDepositRaw < 0) {
    return { ok: false, error: "Security Deposit cannot be negative" }
  }

  const maxCapacityRaw = Number(body.maxCapacity ?? 1)
  if (!Number.isInteger(maxCapacityRaw) || maxCapacityRaw < 1) {
    return { ok: false, error: "Max Capacity must be at least 1 person" }
  }

  const images = asStringArray(body.images)
  const finalImage =
    imageUrl || images[0] || `/images/studios/studio-1.jpg`
  const finalImages = images.length ? images : [finalImage]

  return {
    ok: true,
    input: {
      name,
      category,
      hourlyRate,
      securityDeposit: securityDepositRaw,
      maxCapacity: maxCapacityRaw,
      location,
      imageUrl: finalImage,
      images: finalImages,
      amenities: asStringArray(body.amenities),
      overview,
    },
  }
}
