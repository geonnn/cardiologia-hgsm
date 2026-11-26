import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import { AppSidebar } from './AppSidebar'

const esDesktopInicial = () => (typeof window === 'undefined' ? true : window.innerWidth >= 768)

/**
 * Shell principal con barra lateral colapsable a la izquierda y contenido scrollable a la derecha.
 * En desktop se repliega a un riel compacto de íconos (sin agregar barras superiores que desplacen el contenido);
 * en mobile se abre como drawer superpuesto sobre un botón fijo de menú.
 */
export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(esDesktopInicial)

  const cerrarEnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="relative flex h-svh w-full overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <AppSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onNavigate={cerrarEnMobile}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Barra mobile siempre presente para que abrir/cerrar el drawer no desplace el contenido */}
        <div className="flex shrink-0 items-center border-b border-border/70 bg-background px-4 py-2.5 md:hidden">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            title="Mostrar panel lateral"
            aria-label="Mostrar panel lateral"
          >
            <MenuIcon className="size-4" />
            <span>Menú</span>
          </Button>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
