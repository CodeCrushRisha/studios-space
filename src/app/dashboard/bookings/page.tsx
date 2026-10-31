import { redirect } from "next/navigation"

export default function LegacyBookingsRedirect() {
  redirect("/my-bookings")
}
