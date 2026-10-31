import Link from "next/link"
import { Button } from "@/components/ui/button"

function StudioIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="Illustration of a film camera on a tripod under a studio spotlight"
      className={className}
      fill="none"
    >
      <circle cx="160" cy="120" r="110" className="fill-muted" />
      <ellipse cx="160" cy="210" rx="120" ry="10" className="fill-muted-foreground/10" />

      <polygon
        points="48,28 150,110 96,140"
        className="fill-primary/10"
      />
      <circle cx="42" cy="24" r="16" className="fill-primary" />
      <circle cx="42" cy="24" r="9" className="fill-primary/60" />
      <path
        d="M42 40v10"
        className="stroke-foreground"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M160 210 128 150M160 210l32-60M160 210v-55"
        className="stroke-foreground"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M139 175h42"
        className="stroke-foreground"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <rect
        x="118"
        y="86"
        width="84"
        height="52"
        rx="10"
        className="fill-card stroke-foreground"
        strokeWidth="4"
      />
      <circle cx="145" cy="66" r="16" className="fill-card stroke-foreground" strokeWidth="4" />
      <circle cx="181" cy="66" r="16" className="fill-card stroke-foreground" strokeWidth="4" />
      <circle cx="145" cy="66" r="6" className="fill-muted-foreground/40" />
      <circle cx="181" cy="66" r="6" className="fill-muted-foreground/40" />
      <circle
        cx="216"
        cy="112"
        r="20"
        className="fill-card stroke-foreground"
        strokeWidth="4"
      />
      <circle cx="216" cy="112" r="9" className="fill-primary/70" />
      <rect x="128" y="98" width="28" height="12" rx="3" className="fill-primary/30" />

      <g className="stroke-foreground" strokeWidth="4" strokeLinecap="round">
        <path d="M258 176h30" />
        <path d="M258 188h18" />
        <path d="M266 158v-10" />
        <circle cx="266" cy="142" r="8" className="fill-card" />
        <path d="M258 158h16l-3-8h-10z" className="fill-primary/40" />
      </g>

      <path
        d="M70 190c8-18 26-18 34 0"
        className="stroke-muted-foreground/50"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="87" cy="176" r="7" className="fill-primary/40" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8">
      <StudioIllustration className="w-full max-w-sm" />
      <div className="flex max-w-md flex-col items-center gap-4 text-center lg:items-start lg:text-left">
        <p className="text-7xl font-semibold tracking-tight text-muted-foreground/30">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This studio is off camera
        </h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on set.
        </p>
        <Button size="lg" className="mt-2" render={<Link href="/" />}>
          Return to Home
        </Button>
      </div>
    </div>
  )
}
