import {
  BadgeCheckIcon,
  HeadphonesIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react"

const guarantees = [
  {
    title: "Liability Protection",
    description:
      "Every booking is backed by platform liability coverage, for hosts and creators alike.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Verified Profiles",
    description:
      "Hosts and guests verify their identity, so you always know who you're working with.",
    icon: BadgeCheckIcon,
  },
  {
    title: "Equipment Safety",
    description:
      "Damage deposits and clear gear agreements keep equipment protected on every shoot.",
    icon: LockIcon,
  },
  {
    title: "24/7 Host Support",
    description:
      "Real humans around the clock — before, during, and after your session.",
    icon: HeadphonesIcon,
  },
] as const

export function HostGuarantee() {
  return (
    <section
      aria-labelledby="host-guarantee-heading"
      className="border-t bg-muted/30"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            id="host-guarantee-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Host Guarantee & Creator Support
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Book and host with confidence — we&apos;ve got your back at every
            step.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-xl border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-muted text-foreground">
                <item.icon className="size-5" />
              </span>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
