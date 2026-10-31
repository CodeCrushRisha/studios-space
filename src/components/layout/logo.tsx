import Link from "next/link"
import { ApertureIcon } from "lucide-react"
import { cn } from "cn"

export function Logo({
  href = "/",
  className,
}: {
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ApertureIcon className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        StudioSpace
      </span>
    </Link>
  )
}
