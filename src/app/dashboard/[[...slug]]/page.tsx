import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Building2Icon,
  CalendarDaysIcon,
  PlusCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "Dashboard",
}

const sectionRoutes: Record<string, string> = {
  "add-studio": "/add-studio",
  studios: "/my-listings",
  bookings: "/my-bookings",
}

const hubLinks = [
  {
    href: "/my-listings",
    title: "My Studio Listings",
    description: "Update or remove the workspaces you own.",
    icon: Building2Icon,
  },
  {
    href: "/add-studio",
    title: "Add New Studio",
    description: "Publish a new workspace with photos and amenities.",
    icon: PlusCircleIcon,
  },
  {
    href: "/my-bookings",
    title: "My Bookings",
    description: "Track reservation status and download invoices.",
    icon: CalendarDaysIcon,
  },
] as const

export default async function DashboardPage(
  props: PageProps<"/dashboard/[[...slug]]">,
) {
  const { slug } = await props.params
  const section = slug?.[0]
  if (section && sectionRoutes[section]) {
    redirect(sectionRoutes[section])
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHero
        title="Dashboard"
        description="Manage your studios and bookings from one place."
      />
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {hubLinks.map((link) => (
          <Card key={link.href} className="h-full">
            <CardHeader>
              <link.icon className="size-5 text-primary" />
              <CardTitle className="text-base">{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                variant="outline"
                className="w-full"
                render={<Link href={link.href} />}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
