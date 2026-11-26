/** Tarjetas de relleno mientras se cargan las camas por primera vez. */
export function CamaGridSkeleton({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <div
      className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:gap-4"
      aria-hidden="true"
    >
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="min-h-42 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}
