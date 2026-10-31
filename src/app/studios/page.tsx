import type { Metadata } from "next"
import { SearchXIcon } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { StudioCard } from "@/components/home/studio-card"
import { StudiosToolbar } from "@/components/studios/studios-toolbar"
import { categoryLabelFor, getStudios } from "@/lib/studios"

export const metadata: Metadata = {
  title: "Explore Studios",
}

export default async function StudiosPage(props: PageProps<"/studios">) {
  const searchParams = await props.searchParams
  const rawQuery = searchParams.q
  const rawCategory = searchParams.category
  const query =
    typeof rawQuery === "string" ? rawQuery.trim().toLowerCase() : ""
  const category = typeof rawCategory === "string" ? rawCategory : ""

  const studios = await getStudios()
  const filtered = studios.filter((studio) => {
    const matchesCategory = !category || studio.category === category
    const matchesQuery =
      !query ||
      studio.name.toLowerCase().includes(query) ||
      studio.location.toLowerCase().includes(query) ||
      studio.categoryLabel.toLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore Studios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find and book the perfect space for your next shoot, session, or
          workshop.
        </p>
      </div>

      <StudiosToolbar
        initialQuery={typeof rawQuery === "string" ? rawQuery : ""}
        initialCategory={category}
      />

      <p
        aria-live="polite"
        className="mt-6 text-sm text-muted-foreground"
      >
        {filtered.length === 0
          ? "No studios found"
          : `Showing ${filtered.length} studio${filtered.length === 1 ? "" : "s"}`}
        {category ? ` in ${categoryLabelFor(category)}` : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={SearchXIcon}
          title="No studios match your search"
          description="Try a different keyword or clear your filters to browse every space on StudioSpace."
          action={{ label: "Clear filters", href: "/studios" }}
        />
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  )
}
