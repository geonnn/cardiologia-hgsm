import type { ReactNode } from 'react'

interface SidebarLayoutProps {
  /** Contenido de la barra lateral (solo visible desde `md`). */
  sidebar: ReactNode
  sidebarLabel?: string
  children: ReactNode
}

/** Layout de dos columnas: sidebar a la izquierda en desktop, una sola columna en mobile. */
export function SidebarLayout({ sidebar, sidebarLabel, children }: SidebarLayoutProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside
        aria-label={sidebarLabel}
        className="hidden min-h-[calc(100vh-80px)] space-y-5 border-r py-7 pr-5 pl-7 md:block"
      >
        {sidebar}
      </aside>
      <main className="min-w-0 p-4 md:p-7">{children}</main>
    </div>
  )
}

interface SidebarSectionProps {
  title?: string
  children: ReactNode
}

/** Bloque con título dentro de la sidebar. */
export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section>
      {title && <h2 className="mb-3 text-[15px] font-semibold text-muted-foreground">{title}</h2>}
      {children}
    </section>
  )
}
