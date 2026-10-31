import { NextResponse } from "next/server"

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

/**
 * POST /api/upload — proxies an image to imgbb and returns its public URL.
 * Requires the IMGBB_API_KEY server environment variable (never exposed
 * to the browser). Returns 501 when uploads are not configured so the UI
 * can fall back to pasting an Image URL.
 */
export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Image upload is not configured on this deployment. Paste an Image URL instead.",
      },
      { status: 501 }
    )
  }

  let body: { image?: string; name?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const base64 = body.image?.replace(/^data:image\/\w+;base64,/, "")
  if (!base64) {
    return NextResponse.json({ error: "Image data is required" }, { status: 400 })
  }

  // Rough decoded-size check before sending the payload upstream.
  if (base64.length > (MAX_UPLOAD_BYTES * 4) / 3 + 1024) {
    return NextResponse.json(
      { error: "Image is larger than the 10 MB upload limit" },
      { status: 413 }
    )
  }

  const name = body.name?.trim() || `studiospace-${Date.now()}`
  const params = new URLSearchParams({ key: apiKey, name })
  const form = new FormData()
  form.append("image", base64)

  try {
    const upstream = await fetch(
      `https://api.imgbb.com/1/upload?${params.toString()}`,
      { method: "POST", body: form }
    )
    const data = (await upstream.json().catch(() => null)) as {
      success?: boolean
      data?: { url?: string; display_url?: string }
      error?: { message?: string }
    } | null

    const url = data?.data?.display_url ?? data?.data?.url
    if (!upstream.ok || !data?.success || !url) {
      return NextResponse.json(
        { error: data?.error?.message ?? "imgbb upload failed" },
        { status: 502 }
      )
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.warn("StudioSpace: imgbb upload failed.", error)
    return NextResponse.json(
      { error: "Could not reach the image host. Try again." },
      { status: 502 }
    )
  }
}
