import {
  BedDoubleIcon,
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  HeartPulseIcon,
  LogOutIcon,
  StethoscopeIcon,
  UsersIcon,
  type LucideIcon,
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

type NavItem = { to: string; label: string; icon: LucideIcon }

/** Vistas principales del servicio: arriba y destacadas. */
const NAV_PRINCIPAL: ReadonlyArray<NavItem> = [
  { to: '/camas', label: 'Mapa de Camas', icon: BedDoubleIcon },
  { to: '/pacientes', label: 'Pacientes', icon: UsersIcon },
]

/** Catálogos (datos de referencia): abajo y más discretos. */
const NAV_CATALOGOS: ReadonlyArray<NavItem> = [
  { to: '/obras-sociales', label: 'Obras Sociales', icon: Building2Icon },
  { to: '/tipos-estudio', label: 'Tipos de Estudio', icon: ClipboardListIcon },
  { to: '/motivos-internacion', label: 'Motivos de Internación', icon: StethoscopeIcon },
  { to: '/factores-de-riesgo', label: 'Factores de Riesgo', icon: HeartPulseIcon },
]

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
        {NAV_PRINCIPAL.map((item) => (
          <SidebarLink key={item.to} item={item} open={open} onNavigate={onNavigate} />
        ))}

        {/* mt-auto empuja los catálogos al fondo de la barra */}
        <div role="group" aria-label="Catálogos" className="mt-auto flex flex-col gap-0.5 pt-6">
          {/* Línea divisoria entre las vistas principales y los catálogos */}
          <div aria-hidden="true" className="mx-2 mb-1.5 border-t border-white/15" />
          {NAV_CATALOGOS.map((item) => (
            <SidebarLink key={item.to} item={item} open={open} onNavigate={onNavigate} secundario />
          ))}
        </div>
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

interface SidebarLinkProps {
  item: NavItem
  open: boolean
  onNavigate?: () => void
  /** Más chico (catálogos). Mismo color que los principales. */
  secundario?: boolean
}

function SidebarLink({ item: { to, label, icon: Icon }, open, onNavigate, secundario = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={!open ? label : undefined}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3.5 transition-colors',
          secundario ? 'h-9 text-[13px] font-normal' : 'h-10 text-sm font-medium',
          !open && 'md:justify-center md:gap-0 md:px-0',
          isActive
            ? 'bg-brand font-semibold text-brand-foreground shadow-xs'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:text-white',
        )
      }
    >
      <Icon className={cn('shrink-0', secundario ? 'size-4' : 'size-5')} />
      <span className={cn('truncate', !open && 'md:hidden')}>{label}</span>
    </NavLink>
  )
}
