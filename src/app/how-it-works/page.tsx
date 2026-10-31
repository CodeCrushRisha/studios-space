import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "How It Works",
}

export default function HowItWorksPage() {
  return (
    <PageHero
      title="How It Works"
      description="Search for studios, compare spaces and rates, book your hours, and show up ready to create. Full details coming soon."
    />
  )
}
