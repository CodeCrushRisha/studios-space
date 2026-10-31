import type { Metadata } from "next"
import { CalendarDaysIcon, LogInIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { InvoiceButton } from "@/components/studios/invoice-button"
import { getBookingsForUser } from "@/lib/bookings"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "My Bookings",
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

export default async function BookingsPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Bookings
          </h1>
        </div>
        <EmptyState
          icon={LogInIcon}
          title="Log in to see your bookings"
          description="Your booking history and downloadable invoices live behind your StudioSpace account."
          action={{ label: "Log in", href: "/login" }}
        />
      </div>
    )
  }

  const bookings = await getBookingsForUser(session.email)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your upcoming and past studio sessions live here.
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDaysIcon}
          title="No bookings yet"
          description="When you book a studio, your sessions will appear here so you can manage hours, receipts, and details in one place."
          action={{ label: "Explore Studios", href: "/studios" }}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {bookings.map((booking) => {
            const hours = hoursBetween(booking.startTime, booking.endTime)
            const total = hours * booking.hourlyRate
            return (
              <li
                key={booking.id}
                className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-snug">
                    {booking.studioName}
                  </h2>
                  <Badge
                    variant={
                      booking.status === "Confirmed" ? "default" : "secondary"
                    }
                  >
                    {booking.status}
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
                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="text-lg font-semibold">${total.toFixed(2)}</p>
                  <InvoiceButton booking={booking} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
