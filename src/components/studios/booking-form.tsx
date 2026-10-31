"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BookingForm({ studioId }: { studioId: string }) {
  const router = useRouter()
  const [date, setDate] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [endTime, setEndTime] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !startTime || !endTime) {
      toast.error("Pick a date, start time, and end time.")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          startTime: `${date}T${startTime}:00`,
          endTime: `${date}T${endTime}:00`,
        }),
      })
      const data = (await response.json()) as {
        error?: string
        booking?: unknown
      }

      if (response.status === 401) {
        toast.error("Log in to book this studio.")
        router.push("/login")
        return
      }
      if (!response.ok) {
        toast.error(data.error ?? "Booking failed. Please try again.")
        return
      }

      toast.success("Booking confirmed! It's now in My Bookings.")
      router.push("/dashboard/bookings")
      router.refresh()
    } catch {
      toast.error("Booking failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="booking-date">
            <CalendarIcon className="size-3.5" /> Date
          </Label>
          <Input
            id="booking-date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="booking-start">
            <ClockIcon className="size-3.5" /> Start
          </Label>
          <Input
            id="booking-start"
            type="time"
            required
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="booking-end">
            <ClockIcon className="size-3.5" /> End
          </Label>
          <Input
            id="booking-end"
            type="time"
            required
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Booking…" : "Book Instantly"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Conflicting time slots with existing confirmed bookings are
        automatically rejected.
      </p>
    </form>
  )
}
