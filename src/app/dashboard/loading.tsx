import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border bg-card p-6">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  )
}
