export function PageHero({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-balance text-muted-foreground">
        {description}
      </p>
    </section>
  )
}
