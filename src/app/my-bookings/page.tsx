import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CalendarDaysIcon } from "lucide-react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { CancelBookingButton } from "@/components/studios/cancel-booking-button"
import { InvoiceButton } from "@/components/studios/invoice-button"
import { getBookingsForUser, type BookingStatus } from "@/lib/bookings"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "My Bookings",
}

const statusStyles: Record<
  BookingStatus,
  { badge: string; label: string }
> = {
  Pending: {
    label: "Pending",
    badge:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-transparent",
  },
  Confirmed: {
    label: "Confirmed",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-transparent",
  },
  Completed: {
    label: "Completed",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-transparent",
  },
  Cancelled: {
    label: "Cancelled",
    badge: "bg-destructive/15 text-destructive border-transparent",
  },
}

function hoursBetween(startTime: string, endTime: string) {
  return (
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 3_600_000
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function MyBookingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const bookings = await getBookingsForUser(session.email)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your studio reservations live here. Cancel any slot still marked
          Pending.
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDaysIcon}
          title="No bookings yet"
          description="When you reserve a studio, your sessions will appear here with a live status badge and downloadable invoice."
          action={{ label: "Explore Studios", href: "/studios" }}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {bookings.map((booking) => {
            const hours = hoursBetween(booking.startTime, booking.endTime)
            const total = hours * booking.hourlyRate
            const status = statusStyles[booking.status]
            return (
              <li
                key={booking.id}
                className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-snug">
                    {booking.studioName}
                  </h2>
                  <Badge className={cn("border", status.badge)}>
                    {status.label}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Start:</span>{" "}
                    {formatDateTime(booking.startTime)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">End:</span>{" "}
                    {formatDateTime(booking.endTime)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Hours:</span>{" "}
                    {hours.toFixed(1)} ·{" "}
                    <span className="font-medium text-foreground">
                      ${booking.hourlyRate}/hr
                    </span>
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <p className="text-lg font-semibold">${total.toFixed(2)}</p>
                  <div className="flex gap-2">
                    {booking.status === "Pending" && (
                      <CancelBookingButton bookingId={booking.id} />
                    )}
                    <InvoiceButton booking={booking} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
