import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AppHeader, PageTitle, SidebarLayout, SidebarSection } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { CamaGrid } from '../components/CamaGrid'
import { EstadoFilter } from '../components/EstadoFilter'
import { NuevaCamaDialog } from '../components/NuevaCamaDialog'
import { OcupacionResumen } from '../components/OcupacionResumen'
import { SectorSelector } from '../components/SectorSelector'
import { ESTADO_CONFIG } from '../constants'
import { camasMock } from '../data/camas.mock'
import { useCamas } from '../hooks/useCamas'
import type { AccionCama, Cama, NuevaCama } from '../types'

export function CamasPage() {
  const { camas, sector, filtro, conteos, visibles, totalPorSector, cambiarSector, setFiltro, cambiarEstado, crearCama } =
    useCamas(camasMock)
  const [creandoCama, setCreandoCama] = useState(false)

  const confirmarNuevaCama = (datos: NuevaCama) => {
    const cama = crearCama(datos)
    setCreandoCama(false)
    toast(`Cama ${cama.numero} de ${cama.sector} creada`)
  }

  const abrirFicha = (cama: Cama) => toast(`Abriendo ficha de ${cama.paciente?.nombre}…`)

  const ejecutarAccion = (cama: Cama, accion: AccionCama) => {
    if (accion.nuevoEstado) {
      cambiarEstado(cama.id, accion.nuevoEstado)
      toast(`Cama ${cama.numero} de ${cama.sector} ${accion.mensaje ?? 'actualizada'}`)
    } else {
      toast(`${accion.label}…`)
    }
  }

  return (
    <>
      <AppHeader
        actions={
          <Button
            variant="brand"
            size="lg"
            className="hidden h-11 border-2 border-background px-4 font-semibold md:inline-flex"
            onClick={() => setCreandoCama(true)}
          >
            + Nueva cama
          </Button>
        }
      />

      <SidebarLayout
        sidebarLabel="Filtros"
        sidebar={
          <>
            <SidebarSection title="Filtrar por estado">
              <EstadoFilter variant="list" value={filtro} onChange={setFiltro} conteos={conteos} />
            </SidebarSection>
            <SidebarSection>
              <OcupacionResumen sector={sector} ocupadas={conteos.ocupada} total={conteos.todos} />
            </SidebarSection>
          </>
        }
      >
        <PageTitle>Camas</PageTitle>

        <SectorSelector value={sector} onChange={cambiarSector} totalPorSector={totalPorSector} />

        <EstadoFilter className="md:hidden" value={filtro} onChange={setFiltro} conteos={conteos} />

        <p className="sr-only" aria-live="polite">
          Mostrando {visibles.length} camas de {sector}
        </p>

        <CamaGrid
          camas={visibles}
          onAbrirFicha={abrirFicha}
          onAccion={ejecutarAccion}
          empty={
            filtro !== 'todos' && (
              <Empty className="col-span-full border-2 border-dashed">
                <EmptyHeader>
                  <EmptyTitle className="font-extrabold">
                    No hay camas {ESTADO_CONFIG[filtro].plural} en {sector}.
                  </EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" size="lg" className="h-11 px-4" onClick={() => setFiltro('todos')}>
                    Quitar filtro
                  </Button>
                </EmptyContent>
              </Empty>
            )
          }
        />
      </SidebarLayout>

      {/* Botón flotante (solo mobile) */}
      <Button
        variant="brand"
        size="icon-lg"
        aria-label="Nueva cama"
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-10 size-15 rounded-full shadow-lg md:hidden"
        onClick={() => setCreandoCama(true)}
      >
        <PlusIcon className="size-7" strokeWidth={2.5} />
      </Button>

      <NuevaCamaDialog
        open={creandoCama}
        onOpenChange={setCreandoCama}
        sectorInicial={sector}
        camasExistentes={camas}
        onCrear={confirmarNuevaCama}
      />
    </>
  )
}
