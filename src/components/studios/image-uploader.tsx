"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Uploads an image file to imgbb through /api/upload and reports the
 * resulting public URL. Falls back gracefully when uploads are disabled.
 */
export function ImageUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WebP…).")
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is larger than the 10 MB upload limit.")
      return
    }

    setUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("Could not read the file"))
        reader.readAsDataURL(file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          name: file.name.replace(/\.[^.]+$/, ""),
        }),
      })
      const data = (await response.json().catch(() => null)) as {
        url?: string
        error?: string
      }

      if (!response.ok || !data?.url) {
        toast.error(data?.error ?? "Image upload failed")
        return
      }

      onUploaded(data.url)
      toast.success("Image uploaded — URL added to the listing.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      )
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <UploadIcon />
        )}
        {uploading ? "Uploading…" : "Upload Image"}
      </Button>
    </>
  )
}
