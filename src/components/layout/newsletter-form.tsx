"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail("")
    toast.success("Subscribed! Watch your inbox for studio deals.")
  }

  if (subscribed) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckIcon className="size-4 text-foreground" />
        You&apos;re subscribed — welcome aboard!
      </p>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-sm items-center gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-9 flex-1"
      />
      <Button type="submit" className="h-9">
        Subscribe
      </Button>
    </form>
  )
}
