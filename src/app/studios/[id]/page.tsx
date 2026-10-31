import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeCheckIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookWorkspaceButton } from "@/components/studios/book-workspace-button"
import { GalleryCarousel } from "@/components/studios/gallery-carousel"
import { WishlistButton } from "@/components/wishlist-button"
import { getStudioById } from "@/lib/studios"

export const metadata: Metadata = {
  title: "Studio Details",
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <StarIcon
          key={step}
          className={
            step <= Math.round(rating)
              ? "size-4 fill-amber-500 text-amber-500"
              : "size-4 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  )
}

export default async function StudioDetailPage(
  props: PageProps<"/studios/[id]">
) {
  const { id } = await props.params
  const studio = await getStudioById(id)
  if (!studio) notFound()

  const images = studio.images.length ? studio.images : [studio.imageUrl]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/studios"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Back to all studios
        </Link>
        <WishlistButton studioId={studio.id} size="icon" />
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-8">
          <GalleryCarousel images={images} name={studio.name} />

          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-lg font-semibold">
              Workspace Overview
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {studio.overview || "No overview has been provided yet."}
            </p>
          </section>

          <section aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="text-lg font-semibold">
              Amenities
            </h2>
            {studio.amenities.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {studio.amenities.map((amenity) => (
                  <li key={amenity}>
                    <Badge variant="secondary" className="px-3 py-1">
                      {amenity}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No amenities listed for this workspace.
              </p>
            )}
          </section>

          <section aria-labelledby="reviews-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="reviews-heading" className="text-lg font-semibold">
                Reviews
              </h2>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Stars rating={studio.rating} />
                {studio.rating.toFixed(1)} · {studio.reviewCount} reviews
              </span>
            </div>
            {studio.reviews.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {studio.reviews.map((review) => (
                  <li
                    key={`${review.author}-${review.date}`}
                    className="rounded-xl border bg-card p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{review.author}</p>
                      <span className="flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en-US", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No reviews yet — be the first to book and share your
                experience.
              </p>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {studio.name}
                </h1>
                <Badge className="bg-background shadow-sm">
                  {studio.categoryLabel}
                </Badge>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPinIcon className="size-4" />
                {studio.location}
              </p>
            </div>

            <p className="text-3xl font-semibold">
              ${studio.hourlyRate}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / hr
              </span>
            </p>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <WalletIcon className="size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Security deposit
                  </dt>
                  <dd className="font-medium">${studio.securityDeposit}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <UsersIcon className="size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Max capacity
                  </dt>
                  <dd className="font-medium">
                    {studio.maxCapacity > 0
                      ? `${studio.maxCapacity} people`
                      : "—"}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <ClockIcon className="size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Booking</dt>
                  <dd className="font-medium">Hourly</dd>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <StarIcon className="size-4 text-amber-500" />
                <div>
                  <dt className="text-xs text-muted-foreground">Rating</dt>
                  <dd className="font-medium">
                    {studio.rating.toFixed(1)} ({studio.reviewCount})
                  </dd>
                </div>
              </div>
            </dl>

            <BookWorkspaceButton
              studioId={studio.id}
              studioName={studio.name}
            />
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">Hosted by</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {(studio.ownerName ?? "StudioSpace")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-medium">
                  {studio.ownerName ?? "StudioSpace Partner"}
                  <BadgeCheckIcon className="size-4 text-emerald-500" />
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {studio.ownerEmail ?? "partners@studiospace.test"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Verified StudioSpace hosts respond within a few hours and must
              honor every confirmed reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
