"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { useAuth } from "@/lib/auth"

function passwordErrors(password: string) {
  const errors: string[] = []
  if (password.length < 6) {
    errors.push("At least 6 characters")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("One lowercase letter")
  }
  return errors
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [photoUrl, setPhotoUrl] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const errors = passwordErrors(password)
  const showPasswordError = password.length > 0 || submitted

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (errors.length > 0) {
      toast.error(
        "Password does not meet the requirements shown below the field."
      )
      return
    }

    try {
      await register(name, email, password, photoUrl.trim() || undefined)
      toast.success("Account created! Please log in to continue.")
      router.push("/login")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      )
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Registration</CardTitle>
          <CardDescription>
            Join StudioSpace to book studios or list your own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-name">Name</Label>
              <Input
                id="register-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-photo">Photo URL</Label>
              <Input
                id="register-photo"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                required
                aria-invalid={showPasswordError && errors.length > 0}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div aria-live="polite">
                {showPasswordError && errors.length > 0 ? (
                  <ul className="flex flex-col gap-0.5 text-xs text-destructive">
                    {errors.map((error) => (
                      <li key={error}>• {error}</li>
                    ))}
                  </ul>
                ) : password.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Password meets all requirements.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Must include an uppercase letter, a lowercase letter, and at
                    least 6 characters.
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
            <div className="relative text-center text-xs text-muted-foreground">
              <span className="relative z-10 bg-card px-2">or</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px bg-border"
              />
            </div>
            <GoogleSignInButton />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
