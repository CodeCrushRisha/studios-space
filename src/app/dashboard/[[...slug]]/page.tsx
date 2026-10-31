import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "Dashboard",
}

const sectionTitles: Record<string, string> = {
  "add-studio": "Add New Studio",
  studios: "My Studio Listings",
  bookings: "My Bookings",
}

export default async function DashboardPage(
  props: PageProps<"/dashboard/[[...slug]]">,
) {
  const { slug } = await props.params
  const section = slug?.[0]
  const title = (section ? sectionTitles[section] : undefined) ?? "Dashboard"

  return (
    <PageHero
      title={title}
      description="Your personalized StudioSpace dashboard is under construction. Check back soon."
    />
  )
}
