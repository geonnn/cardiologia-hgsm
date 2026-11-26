import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AppHeader, PageTitle } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { mensajeDeError } from '@/lib/api'
import type { ObraSocial } from '../api/obrasSocialesApi'
import { BuscadorObraSocial } from '../components/BuscadorObraSocial'
import { EliminarObraSocialDialog } from '../components/EliminarObraSocialDialog'
import { ObraSocialDialog } from '../components/ObraSocialDialog'
import { ObrasSocialesList, ObrasSocialesListSkeleton } from '../components/ObrasSocialesList'
import { useObrasSociales } from '../hooks/useObrasSociales'

/** Listado (RF-21), búsqueda (RF-21.1), alta (RF-20), modificación (RF-22) y baja (RF-23) de obras sociales. */
export function ObrasSocialesPage() {
  const {
    busqueda,
    setBusqueda,
    busquedaAplicada,
    todas,
    visibles,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    crear,
    modificar,
    eliminar,
  } = useObrasSociales()

  // El `open` va aparte de la obra social para que el texto de los modales no cambie mientras se cierran
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [aModificar, setAModificar] = useState<ObraSocial>()
  const [eliminarAbierto, setEliminarAbierto] = useState(false)
  const [aEliminar, setAEliminar] = useState<ObraSocial>()

  const abrirAlta = () => {
    setAModificar(undefined)
    setFormularioAbierto(true)
  }

  const abrirModificacion = (obraSocial: ObraSocial) => {
    setAModificar(obraSocial)
    setFormularioAbierto(true)
  }

  const abrirEliminacion = (obraSocial: ObraSocial) => {
    setAEliminar(obraSocial)
    setEliminarAbierto(true)
  }

  // Si la API rechaza, el error vuelve al formulario (que lo muestra) y el modal queda abierto
  const guardar = async (nombre: string) => {
    if (aModificar) {
      await modificar(aModificar.id, nombre)
      toast.success(`Obra social ${nombre} modificada`)
    } else {
      await crear(nombre)
      toast.success(`Obra social ${nombre} creada`)
    }
    setFormularioAbierto(false)
  }

  const confirmarEliminacion = async (obraSocial: ObraSocial) => {
    try {
      await eliminar(obraSocial.id)
      toast.success(`Obra social ${obraSocial.nombre} eliminada`)
    } catch (e) {
      // Ej. 409 Catalogo.EnUso: está asociada a una internación
      toast.error(mensajeDeError(e))
    }
  }

  const contenido = () => {
    if (error && visibles.length === 0) {
      return (
        <Empty className="mt-3 border-2 border-dashed">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se pudieron cargar las obras sociales</EmptyTitle>
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

    if (cargandoInicial) return <ObrasSocialesListSkeleton />

    return (
      <ObrasSocialesList
        obrasSociales={visibles}
        resaltar={busquedaAplicada}
        onModificar={abrirModificacion}
        onEliminar={abrirEliminacion}
        empty={
          <Empty className="mt-3 border-2 border-dashed">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                {busquedaAplicada
                  ? `No hay obras sociales que coincidan con “${busquedaAplicada}”.`
                  : 'No hay obras sociales cargadas.'}
              </EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              {busquedaAplicada ? (
                <Button variant="outline" size="lg" className="h-11 px-4" onClick={() => setBusqueda('')}>
                  Limpiar búsqueda
                </Button>
              ) : (
                <Button variant="brand" size="lg" className="h-11 px-4" onClick={abrirAlta}>
                  <PlusIcon data-icon="inline-start" />
                  Nueva obra social
                </Button>
              )}
            </EmptyContent>
          </Empty>
        }
      />
    )
  }

  return (
    <>
      <AppHeader />

      <main className="mx-auto max-w-3xl p-4 md:p-7">
        <PageTitle>Obras sociales</PageTitle>

        <div className="flex items-center gap-3">
          <BuscadorObraSocial value={busqueda} onChange={setBusqueda} className="min-w-0 flex-1" />
          <Button
            variant="brand"
            size="lg"
            aria-label="Nueva obra social"
            className="h-14 shrink-0 px-4 font-semibold"
            onClick={abrirAlta}
          >
            <PlusIcon data-icon="inline-start" className="size-5" strokeWidth={2.5} />
            {/* En pantallas angostas sólo se ve el "+" */}
            <span className="hidden sm:inline">Nueva obra social</span>
          </Button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {cargandoInicial
            ? 'Cargando obras sociales…'
            : busquedaAplicada
              ? `${visibles.length} de ${todas.length} obras sociales`
              : `${todas.length} obras sociales`}
        </p>

        <div aria-busy={actualizando} className={actualizando ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {contenido()}
        </div>
      </main>

      <ObraSocialDialog
        open={formularioAbierto}
        onOpenChange={setFormularioAbierto}
        obraSocial={aModificar}
        existentes={todas}
        onGuardar={guardar}
      />

      <EliminarObraSocialDialog
        open={eliminarAbierto}
        obraSocial={aEliminar}
        onOpenChange={setEliminarAbierto}
        onConfirmar={confirmarEliminacion}
      />
    </>
  )
}
