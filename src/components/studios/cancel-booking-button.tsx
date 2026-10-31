"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CalendarXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [cancelling, setCancelling] = React.useState(false)

  async function handleCancel() {
    setCancelling(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      })
      const data = (await response.json().catch(() => null)) as {
        error?: string
      }

      if (response.status === 401) {
        toast.error("Log in to manage your bookings.")
        router.push("/login")
        return
      }
      if (!response.ok) {
        toast.error(data?.error ?? "Could not cancel the booking")
        return
      }

      toast.success("Booking cancelled.")
      router.refresh()
    } catch {
      toast.error("Could not cancel the booking. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={cancelling}
      onClick={() => void handleCancel()}
    >
      <CalendarXIcon />
      {cancelling ? "Cancelling…" : "Cancel Booking"}
    </Button>
  )
}
