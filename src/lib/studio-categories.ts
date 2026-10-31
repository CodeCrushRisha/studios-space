export const studioCategories = [
  {
    slug: "photo",
    label: "Photo Studio",
    image: "/images/categories/photo.jpg",
    description: "Natural light, cycloramas, and fully equipped stills sets.",
  },
  {
    slug: "sound-stage",
    label: "Film Stage",
    image: "/images/categories/sound-stage.jpg",
    description: "Spacious stages with pro lighting grids and green screens.",
  },
  {
    slug: "podcast",
    label: "Podcast Lounge",
    image: "/images/categories/podcast.jpg",
    description: "Acoustically treated rooms, ready to press record.",
  },
  {
    slug: "music",
    label: "Music Suite",
    image: "/images/categories/music.jpg",
    description: "Tracking rooms, rehearsal spaces, and live rooms.",
  },
  {
    slug: "art",
    label: "Workshop",
    image: "/images/categories/art.jpg",
    description: "Mess-friendly studios for painting, ceramics, and craft.",
  },
] as const

export const amenityOptions = [
  "Wi-Fi",
  "Parking",
  "Natural Light",
  "Green Screen",
  "Lighting Kit",
  "Audio Gear",
  "Cyclorama",
  "Makeup Area",
  "Kitchen",
  "Restroom",
  "Blackout Blinds",
  "Wheelchair Access",
] as const

export function categoryLabelFor(slug: string) {
  return (
    studioCategories.find((category) => category.slug === slug)?.label ?? slug
  )
}
