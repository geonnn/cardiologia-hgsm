import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PageTitle, SidebarLayout, SidebarSection } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { RegistrarAltaDialog, registrarAlta, type RegistrarAltaPayload } from '@/features/internaciones'
import { mensajeDeError } from '@/lib/api'
import { CamaGrid } from '../components/CamaGrid'
import { CamaGridSkeleton } from '../components/CamaGridSkeleton'
import { EstadoFilter } from '../components/EstadoFilter'
import { NuevaCamaDialog } from '../components/NuevaCamaDialog'
import { OcupacionResumen } from '../components/OcupacionResumen'
import { SectorSelector } from '../components/SectorSelector'
import { ESTADO_CONFIG } from '../constants'
import { useCamas } from '../hooks/useCamas'
import type { AccionCama, Cama, NuevaCama } from '../types'

export function CamasPage() {
  const navigate = useNavigate()
  const {
    sector,
    filtro,
    todas,
    visibles,
    conteos,
    totalPorSector,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    cambiarSector,
    setFiltro,
    crearCama,
    cambiarEstado,
  } = useCamas()
  const [creandoCama, setCreandoCama] = useState(false)
  const [altaAbierta, setAltaAbierta] = useState(false)
  const [camaParaAlta, setCamaParaAlta] = useState<Cama>()

  // Si la API rechaza, el error vuelve al formulario (que lo muestra) y el modal queda abierto
  const confirmarNuevaCama = async (datos: NuevaCama) => {
    await crearCama(datos)
    setCreandoCama(false)
    toast.success(`Cama ${datos.numero} de ${datos.sector} creada`)
  }

  const confirmarAlta = async (payload: RegistrarAltaPayload) => {
    if (!camaParaAlta?.paciente) return
    await registrarAlta(camaParaAlta.paciente.internacionId, payload)
    toast.success(`Egreso registrado. La cama ${camaParaAlta.sector} #${camaParaAlta.numero} quedó disponible`)
    recargar()
  }

  const abrirFicha = (cama: Cama) => {
    if (cama.paciente) {
      navigate(`/internaciones/${cama.paciente.internacionId}`)
    }
  }

  const iniciarInternacion = (cama: Cama) => {
    navigate(`/internaciones/nueva?camaId=${cama.id}`)
  }

  const ejecutarAccion = async (cama: Cama, accion: AccionCama) => {
    if (accion.id === 'nueva-internacion') {
      navigate(`/internaciones/nueva?camaId=${cama.id}`)
      return
    }
    if (accion.id === 'ver-internacion' && cama.paciente) {
      navigate(`/internaciones/${cama.paciente.internacionId}`)
      return
    }
    if (accion.id === 'ver-ficha' && cama.paciente) {
      navigate(`/pacientes/${cama.paciente.pacienteId}`)
      return
    }
    if (accion.id === 'fin-internacion' && cama.paciente) {
      setCamaParaAlta(cama)
      setAltaAbierta(true)
      return
    }
    if (!accion.accionApi) {
      toast(`${accion.label}…`)
      return
    }
    try {
      await cambiarEstado(cama, accion.accionApi)
      toast.success(`Cama ${cama.numero} de ${cama.sector} ${accion.mensaje ?? 'actualizada'}`)
    } catch (e) {
      toast.error(mensajeDeError(e))
    }
  }

  const contenido = () => {
    if (error && visibles.length === 0) {
      return (
        <Empty className="mt-3 border-2 border-dashed">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se pudieron cargar las camas</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="lg" className="h-11 px-4" onClick={recargar}>
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    if (cargandoInicial) return <CamaGridSkeleton />

    return (
      <CamaGrid
        camas={visibles}
        onAbrirFicha={abrirFicha}
        onIniciarInternacion={iniciarInternacion}
        onAccion={ejecutarAccion}
        empty={
          <Empty className="col-span-full border-2 border-dashed">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                {filtro === 'todos'
                  ? `No hay camas cargadas en ${sector}.`
                  : `No hay camas ${ESTADO_CONFIG[filtro].plural} en ${sector}.`}
              </EmptyTitle>
            </EmptyHeader>
            {filtro !== 'todos' && (
              <EmptyContent>
                <Button variant="outline" size="lg" className="h-11 px-4" onClick={() => setFiltro('todos')}>
                  Quitar filtro
                </Button>
              </EmptyContent>
            )}
          </Empty>
        }
      />
    )
  }

  return (
    <>
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

        <div className="flex items-center gap-3">
          <SectorSelector
            value={sector}
            onChange={cambiarSector}
            totalPorSector={totalPorSector}
            className="min-w-0 flex-1"
          />
          <Button
            variant="brand"
            size="lg"
            aria-label="Nueva cama"
            className="h-14 shrink-0 px-4 font-semibold"
            onClick={() => setCreandoCama(true)}
          >
            <PlusIcon data-icon="inline-start" className="size-5" strokeWidth={2.5} />
            {/* En pantallas angostas sólo se ve el "+" */}
            <span className="hidden sm:inline">Nueva cama</span>
          </Button>
        </div>

        <EstadoFilter className="lg:hidden" value={filtro} onChange={setFiltro} conteos={conteos} />

        <p className="sr-only" aria-live="polite">
          {cargandoInicial ? 'Cargando camas…' : `Mostrando ${visibles.length} camas de ${sector}`}
        </p>

        <div aria-busy={actualizando} className={actualizando ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {contenido()}
        </div>
      </SidebarLayout>

      <NuevaCamaDialog
        open={creandoCama}
        onOpenChange={setCreandoCama}
        sectorInicial={sector}
        camasExistentes={todas}
        onCrear={confirmarNuevaCama}
      />

      {camaParaAlta?.paciente && (
        <RegistrarAltaDialog
          open={altaAbierta}
          pacienteNombre={camaParaAlta.paciente.nombreCompleto}
          camaDescripcion={`${camaParaAlta.sector} #${camaParaAlta.numero}`}
          onOpenChange={setAltaAbierta}
          onConfirmar={confirmarAlta}
        />
      )}
    </>
  )
}
