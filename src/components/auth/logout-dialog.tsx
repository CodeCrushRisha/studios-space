"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"

export function LogoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { logout } = useAuth()

  async function handleConfirm() {
    try {
      await logout()
      onOpenChange(false)
      toast.success("You have been logged out.")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log out of StudioSpace?</DialogTitle>
          <DialogDescription>
            You will need to log in again to manage your studios and bookings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void handleConfirm()}>
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
