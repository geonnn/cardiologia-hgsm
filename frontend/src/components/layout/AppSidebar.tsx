import {
  BedDoubleIcon,
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  UsersIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { toast } from 'sonner'
import logoImg from '@/assets/logo-icono.png'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  open: boolean
  onToggle: () => void
  onNavigate?: () => void
}

const NAV_ITEMS = [
  { to: '/camas', label: 'Mapa de Camas', icon: BedDoubleIcon },
  { to: '/pacientes', label: 'Pacientes', icon: UsersIcon },
  { to: '/obras-sociales', label: 'Obras Sociales', icon: Building2Icon },
] as const

/** Barra lateral de navegación principal (colapsable a riel de íconos en desktop y drawer en mobile). */
export function AppSidebar({ open, onToggle, onNavigate }: AppSidebarProps) {
  return (
    <aside
      aria-label="Navegación principal"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col bg-primary text-primary-foreground shadow-md select-none transition-[transform,width,opacity] duration-200 ease-out md:static md:translate-x-0 md:opacity-100',
        open
          ? 'translate-x-0 opacity-100 md:w-64'
          : 'pointer-events-none invisible -translate-x-full opacity-0 md:pointer-events-auto md:visible md:w-16',
      )}
    >
      {/* Identidad del Servicio y botón de colapsar/expandir */}
      <div
        className={cn(
          'flex h-[76px] shrink-0 items-center gap-3 border-b border-white/15 px-4',
          !open && 'md:justify-center md:gap-0 md:px-2',
        )}
      >
        <img
          src={logoImg}
          alt="Logo Cardiología Hospital San Martín"
          className={cn(
            'size-10 shrink-0 rounded-lg bg-white object-cover',
            !open && 'md:hidden',
          )}
        />
        <div className={cn('min-w-0 flex-1', !open && 'md:hidden')}>
          <p className="truncate text-base font-extrabold tracking-tight text-white">Cardiología</p>
          <p className="truncate text-xs text-primary-foreground/75">Hosp. Gral. San Martín</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          title={open ? 'Ocultar panel lateral' : 'Mostrar panel lateral'}
          aria-label={open ? 'Ocultar panel lateral' : 'Mostrar panel lateral'}
          aria-expanded={open}
          className="grid size-8 shrink-0 place-items-center rounded-md border border-white/20 text-primary-foreground/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          {open ? (
            <ChevronLeftIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </button>
      </div>

      {/* Navegación principal */}
      <nav
        className={cn(
          'flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4',
          !open && 'md:px-2',
        )}
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={!open ? label : undefined}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex h-10 items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-colors',
                !open && 'md:justify-center md:gap-0 md:px-0',
                isActive
                  ? 'bg-brand font-semibold text-brand-foreground shadow-xs'
                  : 'text-primary-foreground/90 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            <span className={cn('truncate', !open && 'md:hidden')}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pie del Sidebar */}
      <div
        className={cn(
          'flex h-[68px] shrink-0 items-center justify-between gap-2 border-t border-white/15 bg-black/15 px-4',
          !open && 'md:justify-center md:gap-0 md:px-2',
        )}
      >
        <div className={cn('min-w-0', !open && 'md:hidden')}>
          <p className="truncate text-sm font-semibold text-white">Personal de Guardia</p>
          <p className="truncate text-xs text-primary-foreground/75">Servicio Cardiología</p>
        </div>
        <button
          type="button"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          onClick={() => toast('Cierre de sesión disponible al integrar autenticación')}
          className="grid size-9 shrink-0 place-items-center rounded-md border border-white/15 text-primary-foreground/85 transition-colors hover:border-transparent hover:bg-brand hover:text-brand-foreground"
        >
          <LogOutIcon className="size-4" />
        </button>
      </div>
    </aside>
  )
}
