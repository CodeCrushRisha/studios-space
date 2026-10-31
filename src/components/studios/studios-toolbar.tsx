"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { studioCategories } from "@/lib/studio-categories"

const categoryFilters = [
  { slug: "", label: "All Categories" },
  ...studioCategories.map((category) => ({
    slug: category.slug as string,
    label: category.label,
  })),
]

export function StudiosToolbar({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string
  initialCategory: string
}) {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)

  function apply(nextQuery: string, nextCategory: string) {
    const params = new URLSearchParams()
    const trimmedQuery = nextQuery.trim()
    if (trimmedQuery) params.set("q", trimmedQuery)
    if (nextCategory) params.set("category", nextCategory)
    const queryString = params.toString()
    router.push(queryString ? `/studios?${queryString}` : "/studios")
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          apply(query, initialCategory)
        }}
        className="flex w-full max-w-xl gap-2"
        role="search"
      >
        <label htmlFor="studio-search" className="sr-only">
          Search studios
        </label>
        <Input
          id="studio-search"
          type="search"
          placeholder="Search by name or location…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-9 flex-1"
        />
        <Button type="submit" className="h-9">
          <SearchIcon />
          Search
        </Button>
      </form>
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {categoryFilters.map((filter) => {
          const isActive = initialCategory === filter.slug
          return (
            <Button
              key={filter.slug}
              size="sm"
              variant={isActive ? "default" : "outline"}
              aria-pressed={isActive}
              className={cn(
                "rounded-full",
                !isActive && "text-muted-foreground"
              )}
              onClick={() => apply(query, filter.slug)}
            >
              {filter.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
