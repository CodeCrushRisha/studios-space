"use client"

import * as React from "react"
import { HeartIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

export function WishlistButton({
  studioId,
  className,
  size = "icon-sm",
}: {
  studioId: string
  className?: string
  size?: "icon-sm" | "icon"
}) {
  const [saved, setSaved] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    fetch("/api/wishlist")
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error())
      )
      .then((data: { studioIds?: string[] }) => {
        if (!cancelled) setSaved(data.studioIds?.includes(studioId) ?? false)
      })
      .catch(() => {
        // Not logged in or request failed — leave heart unselected.
      })
    return () => {
      cancelled = true
    }
  }, [studioId])

  async function toggle() {
    if (busy) return
    setBusy(true)
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioId }),
      })
      if (response.status === 401) {
        toast.error("Log in to save studios to your wishlist.")
        return
      }
      const data = (await response.json()) as { saved?: boolean; error?: string }
      if (!response.ok) {
        toast.error(data.error ?? "Could not update wishlist")
        return
      }
      setSaved(data.saved ?? false)
      toast.success(
        data.saved ? "Saved to your wishlist." : "Removed from your wishlist."
      )
    } catch {
      toast.error("Could not update wishlist")
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      disabled={busy}
      onClick={() => void toggle()}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50",
        size === "icon-sm" ? "size-8" : "size-9",
        className
      )}
    >
      <HeartIcon
        className={cn(
          size === "icon-sm" ? "size-4" : "size-4.5",
          saved && "fill-red-500 text-red-500"
        )}
      />
    </button>
  )
}
