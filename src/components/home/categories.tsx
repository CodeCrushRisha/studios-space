import Image from "next/image"
import Link from "next/link"
import { studioCategories } from "@/lib/studio-categories"

export function CategoryBrowser() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="border-y bg-muted/30"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2
            id="categories-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Browse by Studio Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Jump straight to the kind of space your project needs.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {studioCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/studios?category=${category.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:aspect-[3/4]"
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-semibold">{category.label}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/75">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
