import { Suspense } from "react"
import { CategoryBrowser } from "@/components/home/categories"
import { FeaturedStudios } from "@/components/home/featured-studios"
import { FeaturedStudiosSkeleton } from "@/components/home/featured-studios-skeleton"
import { HeroSlider } from "@/components/home/hero-slider"
import { HostGuarantee } from "@/components/home/host-guarantee"
import { HowBookingWorks } from "@/components/home/how-it-works"
import { getFeaturedStudios } from "@/lib/studios"

async function FeaturedStudiosSection() {
  const studios = await getFeaturedStudios()
  return <FeaturedStudios studios={studios} />
}

export default function Home() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <HeroSlider />
      </section>
      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudiosSection />
      </Suspense>
      <CategoryBrowser />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  )
}
