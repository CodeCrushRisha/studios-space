"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2Icon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
} from "lucide-react"
import { cn } from "cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { LogoutDialog } from "@/components/auth/logout-dialog"
import { useAuth, type AuthUser } from "@/lib/auth"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function initialsOf(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
  return initials || "?"
}

function NavLink({
  href,
  label,
  pathname,
  className,
  onClick,
}: {
  href: string
  label: string
  pathname: string
  className?: string
  onClick?: () => void
}) {
  const isActive = isActivePath(pathname, href)
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "text-foreground after:scale-x-100"
          : "text-muted-foreground after:scale-x-0",
        "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-200",
        className
      )}
    >
      {label}
    </Link>
  )
}

function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = React.useState(false)

  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full p-0.5 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <Avatar size="sm">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          ) : null}
          <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">
          {user.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboardIcon />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/add-studio")}>
          <PlusCircleIcon />
          Add New Studio
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/studios")}>
          <Building2Icon />
          My Studio Listings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/bookings")}>
          <CalendarDaysIcon />
          My Bookings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setLogoutOpen(true)}
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}

function DesktopAuthActions({ user }: { user: AuthUser | null }) {
  if (user) {
    return <UserMenu user={user} />
  }
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" render={<Link href="/login" />}>
        Login
      </Button>
      <Button render={<Link href="/register" />}>Register</Button>
    </div>
  )
}

function MobileNav({ user }: { user: AuthUser | null }) {
  const pathname = usePathname()
  const [logoutOpen, setLogoutOpen] = React.useState(false)

  return (
    <>
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 sm:max-w-sm">
        <SheetHeader className="flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="sr-only">StudioSpace</SheetTitle>
          <Logo />
          <ThemeToggle />
        </SheetHeader>
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 px-4"
        >
          {navLinks.map((link) => (
            <SheetClose
              key={link.href}
              render={
                <Link
                  href={link.href}
                  aria-current={
                    isActivePath(pathname, link.href) ? "page" : undefined
                  }
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActivePath(pathname, link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-1 pb-2">
                <Avatar size="sm">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <SheetClose
                render={<Button variant="outline" className="w-full" />}
              >
                Dashboard
              </SheetClose>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOutIcon />
                Logout
              </Button>
            </>
          ) : (
            <>
              <SheetClose render={<Button variant="outline" className="w-full" />}>
                Login
              </SheetClose>
              <SheetClose render={<Button className="w-full" />}>
                Register
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
      </Sheet>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              pathname={pathname}
            />
          ))}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <DesktopAuthActions user={user} />
        </div>
        <MobileNav user={user} />
      </div>
    </header>
  )
}
