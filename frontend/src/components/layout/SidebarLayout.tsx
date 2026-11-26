import type { ReactNode } from 'react'

interface SidebarLayoutProps {
  /** Contenido de la barra lateral (solo visible desde `md`). */
  sidebar: ReactNode
  sidebarLabel?: string
  children: ReactNode
}

/** Layout de dos columnas internas (filtros a la izquierda en desktop, una columna en pantallas menores). */
export function SidebarLayout({ sidebar, sidebarLabel, children }: SidebarLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside aria-label={sidebarLabel} className="hidden space-y-5 border-r pr-6 lg:block">
        {sidebar}
      </aside>
      <div className="min-w-0">{children}</div>
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
