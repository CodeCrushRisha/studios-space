"use client"

import * as React from "react"
import { CalendarCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingForm } from "@/components/studios/booking-form"

/**
 * "Book Workspace Now" call-to-action that launches the booking modal.
 */
export function BookWorkspaceButton({
  studioId,
  studioName,
  size = "lg",
}: {
  studioId: string
  studioName: string
  size?: "default" | "lg"
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size={size} className="w-full sm:w-auto">
            <CalendarCheckIcon />
            Book Workspace Now
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {studioName}</DialogTitle>
          <DialogDescription>
            Pick a date and time range. Your reservation is saved as Pending
            and must not overlap other active bookings.
          </DialogDescription>
        </DialogHeader>
        <BookingForm studioId={studioId} />
      </DialogContent>
    </Dialog>
  )
}
