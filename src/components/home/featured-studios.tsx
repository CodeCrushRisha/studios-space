import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { StudioCard } from "@/components/home/studio-card"
import type { Studio } from "@/lib/studios"

export function FeaturedStudios({ studios }: { studios: Studio[] }) {
  return (
    <section
      aria-labelledby="featured-studios-heading"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="featured-studios-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Featured Studios
          </h2>
          <p className="mt-2 text-muted-foreground">
            Top-rated and newest spaces, straight from the StudioSpace
            community.
          </p>
        </div>
        <Link
          href="/studios"
          className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
        >
          View all studios
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </section>
  )
}
