import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { PageHero } from "@/components/page-hero"
import { StudioForm } from "@/components/studios/studio-form"
import { getSession } from "@/lib/session"
import { getStudioById } from "@/lib/studios"

export const metadata: Metadata = {
  title: "Update Studio",
}

export default async function EditStudioPage(
  props: PageProps<"/studios/edit/[id]">
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { id } = await props.params
  const studio = await getStudioById(id)
  if (!studio) notFound()
  if (studio.ownerEmail !== session.email) redirect("/my-listings")

  return (
    <div className="flex flex-1 flex-col">
      <PageHero
        title={`Update ${studio.name}`}
        description="Edit your listing details, amenities, and photos. Host info stays read-only."
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <StudioForm
          mode="edit"
          initial={studio}
          host={{ name: session.name, email: session.email }}
        />
      </div>
    </div>
  )
}
