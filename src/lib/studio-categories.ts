export const studioCategories = [
  {
    slug: "photo",
    label: "Photo Studios",
    image: "/images/categories/photo.jpg",
    description: "Natural light, cycloramas, and fully equipped stills sets.",
  },
  {
    slug: "sound-stage",
    label: "Sound Stages",
    image: "/images/categories/sound-stage.jpg",
    description: "Spacious stages with pro lighting grids and green screens.",
  },
  {
    slug: "podcast",
    label: "Podcast Rooms",
    image: "/images/categories/podcast.jpg",
    description: "Acoustically treated rooms, ready to press record.",
  },
  {
    slug: "music",
    label: "Music Suites",
    image: "/images/categories/music.jpg",
    description: "Tracking rooms, rehearsal spaces, and live rooms.",
  },
  {
    slug: "art",
    label: "Art Workshops",
    image: "/images/categories/art.jpg",
    description: "Mess-friendly studios for painting, ceramics, and craft.",
  },
] as const

export function categoryLabelFor(slug: string) {
  return (
    studioCategories.find((category) => category.slug === slug)?.label ?? slug
  )
}
