import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { PageHero } from "@/components/page-hero"
import { StudioForm } from "@/components/studios/studio-form"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Add New Studio",
}

export default async function AddStudioPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="flex flex-1 flex-col">
      <PageHero
        title="Add New Studio"
        description="List your workspace and start accepting bookings from creators."
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <StudioForm
          mode="create"
          host={{ name: session.name, email: session.email }}
        />
      </div>
    </div>
  )
}
