"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PlusIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/studios/image-uploader"
import { amenityOptions, studioCategories } from "@/lib/studio-categories"
import type { Studio } from "@/lib/studios"

interface HostInfo {
  name: string
  email: string
}

const baseAmenitySet = new Set<string>(amenityOptions)

export function StudioForm({
  mode,
  host,
  initial,
}: {
  mode: "create" | "edit"
  host: HostInfo
  initial?: Studio
}) {
  const router = useRouter()

  const [name, setName] = React.useState(initial?.name ?? "")
  const [category, setCategory] = React.useState(
    initial?.category ?? studioCategories[0].slug
  )
  const [hourlyRate, setHourlyRate] = React.useState(
    initial ? String(initial.hourlyRate) : ""
  )
  const [securityDeposit, setSecurityDeposit] = React.useState(
    initial ? String(initial.securityDeposit) : ""
  )
  const [maxCapacity, setMaxCapacity] = React.useState(
    initial ? String(initial.maxCapacity) : ""
  )
  const [location, setLocation] = React.useState(initial?.location ?? "")
  const [imageUrl, setImageUrl] = React.useState(initial?.imageUrl ?? "")
  const [gallery, setGallery] = React.useState<string[]>(
    initial ? initial.images.filter((src) => src !== initial.imageUrl) : []
  )
  const [amenities, setAmenities] = React.useState<string[]>(
    initial?.amenities ?? []
  )
  const [customAmenity, setCustomAmenity] = React.useState("")
  const [overview, setOverview] = React.useState(initial?.overview ?? "")
  const [submitting, setSubmitting] = React.useState(false)

  function toggleAmenity(option: string) {
    setAmenities((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    )
  }

  function addCustomAmenity() {
    const value = customAmenity.trim()
    if (!value) return
    if (!amenities.includes(value)) {
      setAmenities((current) => [...current, value])
    }
    setCustomAmenity("")
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    const images = [imageUrl, ...gallery].filter(
      (src, index, list) => src && list.indexOf(src) === index
    )

    const payload = {
      name,
      category,
      hourlyRate,
      securityDeposit: securityDeposit || 0,
      maxCapacity: maxCapacity || 1,
      location,
      imageUrl,
      images,
      amenities,
      overview,
    }

    try {
      const response = await fetch(
        mode === "create" ? "/api/studios" : `/api/studios/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const data = (await response.json().catch(() => null)) as {
        error?: string
      }

      if (response.status === 401) {
        toast.error("Log in to continue.")
        router.push("/login")
        return
      }
      if (!response.ok) {
        toast.error(data?.error ?? "Could not save the studio")
        return
      }

      toast.success(
        mode === "create"
          ? "Studio added — it is now in your listings."
          : "Studio updated successfully."
      )
      router.push("/my-listings")
      router.refresh()
    } catch {
      toast.error("Could not save the studio. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="studio-title">Title</Label>
          <Input
            id="studio-title"
            required
            placeholder="Luminous Photo Loft"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-category">Category</Label>
          <NativeSelect
            id="studio-category"
            className="w-full"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {studioCategories.map((option) => (
              <NativeSelectOption key={option.slug} value={option.slug}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-location">Location / Address</Label>
          <Input
            id="studio-location"
            required
            placeholder="Brooklyn, NY"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-rate">Hourly Rate ($)</Label>
          <Input
            id="studio-rate"
            type="number"
            min={1}
            step="0.01"
            required
            placeholder="65"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-deposit">Security Deposit ($)</Label>
          <Input
            id="studio-deposit"
            type="number"
            min={0}
            step="0.01"
            placeholder="130"
            value={securityDeposit}
            onChange={(event) => setSecurityDeposit(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="studio-capacity">Max Capacity</Label>
          <Input
            id="studio-capacity"
            type="number"
            min={1}
            step="1"
            required
            placeholder="12"
            value={maxCapacity}
            onChange={(event) => setMaxCapacity(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="studio-image">Image URL</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="studio-image"
              type="url"
              required
              placeholder="https://i.ibb.co/… (upload or paste a direct image link)"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="flex-1"
            />
            <ImageUploader onUploaded={(url) => setImageUrl(url)} />
          </div>
          {gallery.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {gallery.map((src) => (
                <li
                  key={src}
                  className="flex items-center gap-1 rounded-full border bg-muted/40 py-1 pr-1 pl-3 text-xs"
                >
                  <span className="max-w-40 truncate">{src}</span>
                  <button
                    type="button"
                    aria-label="Remove from gallery"
                    className="inline-flex size-5 items-center justify-center rounded-full hover:bg-muted"
                    onClick={() =>
                      setGallery((current) =>
                        current.filter((item) => item !== src)
                      )
                    }
                  >
                    <XIcon className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="text-sm font-medium">Amenities</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {amenityOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={amenities.includes(option)}
                  onCheckedChange={() => toggleAmenity(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom amenity tag…"
              value={customAmenity}
              onChange={(event) => setCustomAmenity(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addCustomAmenity()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addCustomAmenity}>
              <PlusIcon />
              Add
            </Button>
          </div>
          {amenities.some((item) => !baseAmenitySet.has(item)) && (
            <ul className="flex flex-wrap gap-2">
              {amenities
                .filter((item) => !baseAmenitySet.has(item))
                .map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1 rounded-full border bg-muted/40 py-1 pr-1 pl-3 text-xs"
                  >
                    {item}
                    <button
                      type="button"
                      aria-label={`Remove ${item}`}
                      className="inline-flex size-5 items-center justify-center rounded-full hover:bg-muted"
                      onClick={() =>
                        setAmenities((current) =>
                          current.filter((entry) => entry !== item)
                        )
                      }
                    >
                      <XIcon className="size-3" />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </fieldset>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="studio-overview">Detailed Overview</Label>
          <Textarea
            id="studio-overview"
            required
            rows={5}
            placeholder="Describe the space, gear included, house rules, and what makes it great for creators…"
            value={overview}
            onChange={(event) => setOverview(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <p className="text-sm font-medium">Host (read-only)</p>
          <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="host-name">Name</Label>
              <Input id="host-name" readOnly value={host.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="host-email">Email</Label>
              <Input id="host-email" readOnly value={host.email} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:justify-end"
        )}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/my-listings")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Add Studio"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
