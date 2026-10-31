"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const slides = [
  {
    image: "/images/hero-1.jpg",
    alt: "Photographer working in a bright loft studio",
    headline: "Book the perfect studio by the hour",
    subtext: "Photography studios, sound stages, and more — verified, equipped, and ready when you are.",
  },
  {
    image: "/images/hero-2.jpg",
    alt: "Film crew shooting on a professional sound stage",
    headline: "From podcast rooms to full sound stages",
    subtext: "Filter by category, compare rates, and tour spaces before you commit a single dollar.",
  },
  {
    image: "/images/hero-3.jpg",
    alt: "Creator recording a podcast in a treated studio",
    headline: "List your space. Earn on your terms.",
    subtext: "Hosts on StudioSpace set their own rates, rules, and availability — with support around the clock.",
  },
] as const

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = (emblaApi: CarouselApi) => {
      if (!emblaApi) return
      setCurrent(emblaApi.selectedScrollSnap())
    }
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api) return
    const intervalId = window.setInterval(() => {
      api.scrollNext()
    }, 6000)
    return () => window.clearInterval(intervalId)
  }, [api])

  return (
    <section aria-label="StudioSpace highlights" className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image} className="pl-0">
              <div className="relative h-[26rem] overflow-hidden rounded-2xl sm:h-[30rem] lg:h-[34rem]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                <div className="relative z-10 flex h-full max-w-2xl flex-col items-start justify-center gap-5 p-8 text-white sm:p-12 lg:p-16">
                  <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    {slide.headline}
                  </h1>
                  <p className="max-w-xl text-balance text-sm leading-6 text-white/85 sm:text-lg">
                    {slide.subtext}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90"
                      render={<Link href="/studios" />}
                    >
                      Explore Studios
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                      render={<Link href="/studios" />}
                    >
                      Host Your Space
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 border-white/30 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
        <CarouselNext className="right-4 border-white/30 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
      </Carousel>
      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              current === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  )
}
