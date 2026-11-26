import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { PageTitle } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { mensajeDeError } from '@/lib/api'
import { BuscadorCatalogo } from '../components/BuscadorCatalogo'
import { CatalogoDialog } from '../components/CatalogoDialog'
import { CatalogoList, CatalogoListSkeleton } from '../components/CatalogoList'
import { EliminarCatalogoDialog } from '../components/EliminarCatalogoDialog'
import { useCatalogo } from '../hooks/useCatalogo'
import { textosCatalogo } from '../textos'
import type { CatalogoConfig, ItemCatalogo } from '../types'

/**
 * Vista de un catálogo: listar ordenado alfabéticamente, buscar por nombre, crear, modificar y eliminar.
 * Cada catálogo (obras sociales, tipos de estudio, ...) la usa con su propia `config`.
 */
export function CatalogoPage({ config }: { config: CatalogoConfig }) {
  const textos = textosCatalogo(config)
  const {
    busqueda,
    setBusqueda,
    busquedaAplicada,
    todos,
    visibles,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    crear,
    modificar,
    eliminar,
  } = useCatalogo(config.recurso)

  // El `open` va aparte del elemento para que el texto de los modales no cambie mientras se cierran
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [aModificar, setAModificar] = useState<ItemCatalogo>()
  const [eliminarAbierto, setEliminarAbierto] = useState(false)
  const [aEliminar, setAEliminar] = useState<ItemCatalogo>()

  const abrirAlta = () => {
    setAModificar(undefined)
    setFormularioAbierto(true)
  }

  const abrirModificacion = (item: ItemCatalogo) => {
    setAModificar(item)
    setFormularioAbierto(true)
  }

  const abrirEliminacion = (item: ItemCatalogo) => {
    setAEliminar(item)
    setEliminarAbierto(true)
  }

  // Si la API rechaza, el error vuelve al formulario (que lo muestra) y el modal queda abierto
  const guardar = async (nombre: string) => {
    if (aModificar) {
      await modificar(aModificar.id, nombre)
      toast.success(textos.modificado(nombre))
    } else {
      await crear(nombre)
      toast.success(textos.creado(nombre))
    }
    setFormularioAbierto(false)
  }

  const confirmarEliminacion = async (item: ItemCatalogo) => {
    try {
      await eliminar(item.id)
      toast.success(textos.eliminado(item.nombre))
    } catch (e) {
      // Ej. 409 Catalogo.EnUso: está asociado a una internación o a un estudio
      toast.error(mensajeDeError(e))
    }
  }

  const contenido = () => {
    if (error && visibles.length === 0) {
      return (
        <Empty className="mt-3 border-2 border-dashed">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">{textos.errorCarga}</EmptyTitle>
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

    if (cargandoInicial) return <CatalogoListSkeleton />

    return (
      <CatalogoList
        items={visibles}
        label={config.titulo}
        resaltar={busquedaAplicada}
        onModificar={abrirModificacion}
        onEliminar={abrirEliminacion}
        empty={
          <Empty className="mt-3 border-2 border-dashed">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold break-words">
                {busquedaAplicada ? textos.sinCoincidencias(busquedaAplicada) : textos.vacio}
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
                  {textos.nuevo}
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
      {/* AppShell ya aporta el <main> con su padding */}
      <div className="mx-auto max-w-3xl">
        <PageTitle>{config.titulo}</PageTitle>

        <div className="flex items-center gap-3">
          <BuscadorCatalogo
            value={busqueda}
            onChange={setBusqueda}
            placeholder={textos.buscar}
            label={textos.buscarPorNombre}
            className="min-w-0 flex-1"
          />
          <Button
            variant="brand"
            size="lg"
            aria-label={textos.nuevo}
            className="h-14 shrink-0 px-4 font-semibold"
            onClick={abrirAlta}
          >
            <PlusIcon data-icon="inline-start" className="size-5" strokeWidth={2.5} />
            {/* En pantallas angostas sólo se ve el "+" */}
            <span className="hidden sm:inline">{textos.nuevo}</span>
          </Button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {cargandoInicial
            ? textos.cargando
            : busquedaAplicada
              ? textos.totalFiltrado(visibles.length, todos.length)
              : textos.total(todos.length)}
        </p>

        <div aria-busy={actualizando} className={actualizando ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {contenido()}
        </div>
      </div>

      <CatalogoDialog
        config={config}
        open={formularioAbierto}
        onOpenChange={setFormularioAbierto}
        item={aModificar}
        existentes={todos}
        onGuardar={guardar}
      />

      <EliminarCatalogoDialog
        open={eliminarAbierto}
        item={aEliminar}
        restriccion={config.restriccionEliminar}
        onOpenChange={setEliminarAbierto}
        onConfirmar={confirmarEliminacion}
      />
    </>
  )
}
