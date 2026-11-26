import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  /** Botones a la derecha del header. */
  actions?: ReactNode
}

export function AppHeader({ title = 'Cardiología', subtitle = 'Hospital San Martín', actions }: AppHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b-4 border-brand bg-primary px-4 py-3 text-primary-foreground md:px-7 md:py-4">
      <div className="flex items-center gap-3 leading-tight font-extrabold">
        <span className="grid size-12 flex-none place-items-center rounded-full bg-background text-brand">
          <BrandLogo className="h-[27px] w-8" />
        </span>
        <div>
          {title}
          <small className="block text-xs font-medium opacity-85">{subtitle}</small>
        </div>
      </div>
      {actions && <div className="ml-auto flex gap-2">{actions}</div>}
    </header>
  )
}
