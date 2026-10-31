import {
  CalendarCheckIcon,
  ClapperboardIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react"

const steps = [
  {
    title: "Discover Spaces",
    description:
      "Search studios by category, location, amenities, and hourly rate.",
    icon: SearchIcon,
  },
  {
    title: "Select Shoot Hours",
    description:
      "Pick the exact hours you need — availability updates in real time.",
    icon: ClockIcon,
  },
  {
    title: "Book Instantly",
    description:
      "Confirm and pay in a single step. No back-and-forth emails.",
    icon: CalendarCheckIcon,
  },
  {
    title: "Create & Produce",
    description:
      "Show up, plug in, and make something great. We handle the rest.",
    icon: ClapperboardIcon,
  },
] as const

export function HowBookingWorks() {
  return (
    <section
      aria-labelledby="how-booking-works-heading"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-center">
        <h2
          id="how-booking-works-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          How Booking Works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          From first search to final cut — four simple steps.
        </p>
      </div>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center"
          >
            <span className="absolute top-3 right-3 text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <step.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
