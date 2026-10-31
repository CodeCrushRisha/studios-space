import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "About Us",
}

export default function AboutPage() {
  return (
    <PageHero
      title="About StudioSpace"
      description="We're on a mission to make booking the perfect studio effortless for every creator, team, and brand. More about us coming soon."
    />
  )
}
