import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <PageHero
      title="Privacy Policy"
      description="How StudioSpace collects, uses, and protects your data will be published here soon."
    />
  )
}
