import Image from "next/image"
import Link from "next/link"
import { MapPinIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WishlistButton } from "@/components/wishlist-button"
import type { Studio } from "@/lib/studios"

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={studio.imageUrl}
          alt={studio.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
          {studio.categoryLabel}
        </Badge>
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm"
        >
          <StarIcon className="fill-amber-500 text-amber-500" />
          {studio.rating.toFixed(1)}
        </Badge>
        <WishlistButton
          studioId={studio.id}
          className="absolute right-3 bottom-3"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{studio.name}</h3>
          <p className="shrink-0 text-sm font-semibold">
            ${studio.hourlyRate}
            <span className="font-normal text-muted-foreground"> / hr</span>
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0" />
          {studio.location}
        </p>
        <Button
          variant="outline"
          className="mt-auto w-full"
          render={<Link href={`/studios/${studio.id}`} />}
        >
          View Details
        </Button>
      </div>
    </article>
  )
}
