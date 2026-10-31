import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2Icon, MapPinIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { PageHero } from "@/components/page-hero"
import { DeleteStudioButton } from "@/components/studios/delete-studio-button"
import { getSession } from "@/lib/session"
import { getStudiosByOwner } from "@/lib/studios"

export const metadata: Metadata = {
  title: "My Studio Listings",
}

export default async function MyListingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const studios = await getStudiosByOwner(session.email)

  return (
    <div className="flex flex-1 flex-col">
      <PageHero
        title="My Studio Listings"
        description="Update, manage, or remove the workspaces you own."
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Button render={<Link href="/add-studio" />}>
            <Building2Icon />
            Add New Studio
          </Button>
        </div>

        {studios.length === 0 ? (
          <EmptyState
            icon={Building2Icon}
            title="You don't have any studios yet"
            description="Add your first workspace — set your rate, deposit, capacity, and amenities — and it will appear here for editing."
            action={{ label: "Add New Studio", href: "/add-studio" }}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {studios.map((studio) => (
              <li
                key={studio.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={studio.imageUrl}
                    alt={studio.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
                    {studio.categoryLabel}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold leading-snug">
                      {studio.name}
                    </h2>
                    <p className="shrink-0 text-sm font-semibold">
                      ${studio.hourlyRate}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        / hr
                      </span>
                    </p>
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    {studio.location}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      render={<Link href={`/studios/edit/${studio.id}`} />}
                    >
                      Update
                    </Button>
                    <DeleteStudioButton
                      studioId={studio.id}
                      studioName={studio.name}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
