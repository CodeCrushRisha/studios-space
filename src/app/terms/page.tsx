import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "Terms of Service",
}

export default function TermsPage() {
  return (
    <PageHero
      title="Terms of Service"
      description="The terms governing your use of StudioSpace will be published here soon."
    />
  )
}
