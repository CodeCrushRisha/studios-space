"use client"

import { DownloadIcon } from "lucide-react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"

interface InvoiceBooking {
  id: string
  studioName: string
  startTime: string
  endTime: string
  hourlyRate: number
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

export function InvoiceButton({ booking }: { booking: InvoiceBooking }) {
  function download() {
    const doc = new jsPDF()
    const hours = hoursBetween(booking.startTime, booking.endTime)
    const total = hours * booking.hourlyRate

    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.text("StudioSpace", 20, 28)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(110)
    doc.text("Booking Invoice / Receipt", 20, 36)

    doc.setDrawColor(220)
    doc.line(20, 42, 190, 42)

    doc.setTextColor(20)
    doc.setFontSize(12)
    doc.text(`Invoice #: ${booking.id.slice(0, 12).toUpperCase()}`, 20, 54)
    doc.text(`Issued: ${new Date().toLocaleDateString()}`, 20, 62)

    doc.setFont("helvetica", "bold")
    doc.text("Studio", 20, 78)
    doc.text("Start", 20, 90)
    doc.text("End", 20, 102)
    doc.text("Hours", 20, 114)
    doc.text("Rate", 20, 126)
    doc.text("Total", 20, 138)

    doc.setFont("helvetica", "normal")
    doc.text(booking.studioName, 70, 78)
    doc.text(formatDateTime(booking.startTime), 70, 90)
    doc.text(formatDateTime(booking.endTime), 70, 102)
    doc.text(hours.toFixed(1), 70, 114)
    doc.text(`$${booking.hourlyRate.toFixed(2)} / hr`, 70, 126)
    doc.setFont("helvetica", "bold")
    doc.text(`$${total.toFixed(2)}`, 70, 138)

    doc.setDrawColor(220)
    doc.line(20, 150, 190, 150)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(110)
    doc.text(
      "Thank you for booking with StudioSpace. Studios booked by the hour, made for creators.",
      20,
      162,
      { maxWidth: 170 }
    )

    doc.save(`studiospace-invoice-${booking.id.slice(0, 8)}.pdf`)
  }

  return (
    <Button variant="outline" size="sm" onClick={download}>
      <DownloadIcon />
      Invoice PDF
    </Button>
  )
}
