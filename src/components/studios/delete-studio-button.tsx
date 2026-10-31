"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteStudioButton({
  studioId,
  studioName,
}: {
  studioId: string
  studioName: string
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  async function handleConfirm() {
    setDeleting(true)
    try {
      const response = await fetch(`/api/studios/${studioId}`, {
        method: "DELETE",
      })
      const data = (await response.json().catch(() => null)) as {
        error?: string
      }

      if (response.status === 401) {
        toast.error("Log in to manage your listings.")
        router.push("/login")
        return
      }
      if (!response.ok) {
        toast.error(data?.error ?? "Could not delete the studio")
        return
      }

      setOpen(false)
      toast.success(`"${studioName}" was deleted from your listings.`)
      router.refresh()
    } catch {
      toast.error("Could not delete the studio. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2Icon />
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{studioName}&rdquo;?</DialogTitle>
            <DialogDescription>
              This permanently removes the listing from MongoDB. It cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => void handleConfirm()}
            >
              {deleting ? "Deleting…" : "Delete Studio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
