"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { cn } from "cn"

function subscribeNoop() {
  return () => {}
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
    >
      {mounted ? (
        isDark ? (
          <SunIcon className="size-4" />
        ) : (
          <MoonIcon className="size-4" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  )
}
