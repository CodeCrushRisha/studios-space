import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPinIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BookingForm } from "@/components/studios/booking-form"
import { WishlistButton } from "@/components/wishlist-button"
import { getStudioById } from "@/lib/studios"

export const metadata: Metadata = {
  title: "Studio Details",
}

export default async function StudioDetailPage(
  props: PageProps<"/studios/[id]">
) {
  const { id } = await props.params
  const studio = await getStudioById(id)
  if (!studio) notFound()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/studios"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to all studios
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
          <Image
            src={studio.imageUrl}
            alt={studio.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm">
            {studio.categoryLabel}
          </Badge>
          <WishlistButton
            studioId={studio.id}
            size="icon"
            className="absolute right-4 bottom-4"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {studio.name}
              </h1>
              <Badge
                variant="secondary"
                className="gap-1 bg-background shadow-sm"
              >
                <StarIcon className="fill-amber-500 text-amber-500" />
                {studio.rating.toFixed(1)}
                <span className="text-muted-foreground">
                  ({studio.reviewCount})
                </span>
              </Badge>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-4" />
              {studio.location}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              ${studio.hourlyRate}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / hr
              </span>
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 font-semibold">Book this studio</h2>
            <BookingForm studioId={studio.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
