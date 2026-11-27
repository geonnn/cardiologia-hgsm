import { useState } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PillIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { mensajeDeError } from '@/lib/api'
import { formatearFechaHora } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import type { Tratamiento } from '../api/internacionesApi'
import { useTratamientosInternacion } from '../hooks/useTratamientosInternacion'
import { TratamientoDialog } from './TratamientoDialog'

const SELECT_CLASS =
  'h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface TratamientosInternacionPanelProps {
  internacionId: string
  estaActiva: boolean
}

/** Historial, alta, edición del último esquema y eliminación de tratamientos de una internación (HU-25 a HU-28). */
export function TratamientosInternacionPanel({
  internacionId,
  estaActiva,
}: TratamientosInternacionPanelProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [tratamientoEnEdicion, setTratamientoEnEdicion] = useState<Tratamiento | null>(null)
  const [tratamientoAEliminar, setTratamientoAEliminar] = useState<Tratamiento | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const {
    page,
    setPage,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    ascendente,
    setAscendente,
    limpiarFiltros,
    tieneFiltrosActivos,
    tratamientos,
    tratamientoVigente,
    totalCount,
    totalPages,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    crear,
    modificar,
    eliminar,
  } = useTratamientosInternacion(internacionId, estaActiva)

  const abrirNuevo = () => {
    setTratamientoEnEdicion(null)
    setDialogoAbierto(true)
  }

  const abrirEditar = (item: Tratamiento) => {
    setTratamientoEnEdicion(item)
    setDialogoAbierto(true)
  }

  const confirmarEliminacion = async () => {
    if (!tratamientoAEliminar || eliminando) return
    setEliminando(true)
    try {
      await eliminar(tratamientoAEliminar.id)
      toast.success('Tratamiento eliminado correctamente')
      setTratamientoAEliminar(null)
    } catch (err: unknown) {
      toast.error(mensajeDeError(err))
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de controles (RF-40, RF-41.1, RF-41.2) */}
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-wrap items-end justify-between gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="trat-desde" className="text-xs font-semibold text-primary">
                Fecha desde
              </label>
              <Input
                id="trat-desde"
                type="date"
                max={fechaHasta || undefined}
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="trat-hasta" className="text-xs font-semibold text-primary">
                Fecha hasta
              </label>
              <Input
                id="trat-hasta"
                type="date"
                min={fechaDesde || undefined}
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="trat-orden" className="text-xs font-semibold text-primary">
                Orden
              </label>
              <select
                id="trat-orden"
                className={SELECT_CLASS}
                value={ascendente ? 'asc' : 'desc'}
                onChange={(e) => setAscendente(e.target.value === 'asc')}
              >
                <option value="desc">Más reciente primero</option>
                <option value="asc">Más antiguo primero</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tieneFiltrosActivos && (
              <Button type="button" variant="outline" size="sm" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            )}

            {estaActiva ? (
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="font-semibold"
                onClick={abrirNuevo}
              >
                <PlusIcon className="size-4" strokeWidth={2.5} />
                <span>Nuevo tratamiento</span>
              </Button>
            ) : (
              <Badge variant="outline" className="h-8 px-2.5 text-xs font-medium text-muted-foreground">
                Internación finalizada · solo lectura
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listado de tratamientos */}
      <div
        aria-busy={actualizando}
        className={cn('flex flex-col gap-3 transition-opacity', actualizando && 'opacity-60')}
      >
        {error ? (
          <Empty className="border-2 border-dashed bg-card py-10">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                No se pudieron cargar los tratamientos
              </EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" variant="outline" size="lg" className="h-10 px-4" onClick={recargar}>
                Reintentar
              </Button>
            </EmptyContent>
          </Empty>
        ) : cargandoInicial ? (
          <div className="flex flex-col gap-3" aria-hidden="true">
            <Card className="h-24 animate-pulse bg-muted/40" />
            <Card className="h-24 animate-pulse bg-muted/40" />
          </div>
        ) : tratamientos.length === 0 ? (
          <Empty className="border-2 border-dashed bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PillIcon />
              </EmptyMedia>
              <EmptyTitle className="font-extrabold">
                {tieneFiltrosActivos
                  ? 'No hay tratamientos para el período seleccionado'
                  : 'Sin tratamientos registrados'}
              </EmptyTitle>
              <EmptyDescription>
                {tieneFiltrosActivos
                  ? 'Probá ampliando o limpiando el rango de fechas.'
                  : estaActiva
                    ? 'Registrá el esquema terapéutico e indicaciones vigentes del paciente internado.'
                    : 'No se registraron tratamientos ni indicaciones durante esta internación.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {tieneFiltrosActivos ? (
                <Button type="button" variant="outline" size="lg" className="h-10 px-4" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              ) : estaActiva ? (
                <Button
                  type="button"
                  variant="brand"
                  size="lg"
                  className="h-10 px-4 font-semibold"
                  onClick={abrirNuevo}
                >
                  <PlusIcon className="size-4" strokeWidth={2.5} />
                  <span>Nuevo tratamiento</span>
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {tratamientos.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    'gap-0 border-l-4 py-0 transition-colors',
                    item.esUltimo
                      ? 'border-l-primary bg-card shadow-xs ring-1 ring-primary/15'
                      : 'border-l-muted-foreground/30 bg-muted/20',
                  )}
                >
                  <CardContent className="flex flex-col gap-2.5 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.esUltimo && (
                          <Badge
                            className={cn(
                              'font-semibold',
                              estaActiva
                                ? 'bg-emerald-600 text-white'
                                : 'bg-primary text-primary-foreground',
                            )}
                          >
                            {estaActiva ? 'Tratamiento vigente' : 'Último tratamiento'}
                          </Badge>
                        )}

                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary tabular-nums"
                        >
                          <CalendarIcon className="size-3.5" />
                          <span>{formatearFechaHora(item.fecha)}</span>
                        </Badge>
                      </div>

                      {estaActiva && (
                        <div className="flex flex-wrap items-center gap-2">
                          {item.esUltimo && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => abrirEditar(item)}
                            >
                              <PencilIcon className="size-3.5" />
                              <span>Editar</span>
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setTratamientoAEliminar(item)}
                          >
                            <Trash2Icon className="size-3.5" />
                            <span>Eliminar</span>
                          </Button>
                        </div>
                      )}
                    </div>

                    <p
                      className={cn(
                        'min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]',
                        item.esUltimo ? 'text-foreground' : 'text-foreground/85',
                      )}
                    >
                      {item.descripcion}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
                <span>
                  Total: <strong className="text-foreground">{totalCount}</strong>{' '}
                  {totalCount === 1 ? 'tratamiento' : 'tratamientos'} (Página {page} de {totalPages})
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    <ChevronLeftIcon className="size-4" />
                    <span>Anterior</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <span>Siguiente</span>
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de creación / edición del último tratamiento */}
      <TratamientoDialog
        open={dialogoAbierto}
        tratamiento={tratamientoEnEdicion}
        esquemaVigente={tratamientoVigente?.descripcion ?? null}
        onOpenChange={(next) => {
          setDialogoAbierto(next)
          if (!next) setTratamientoEnEdicion(null)
        }}
        onGuardar={async (payload) => {
          if (tratamientoEnEdicion) {
            await modificar(tratamientoEnEdicion.id, payload)
            toast.success('Tratamiento actualizado correctamente')
          } else {
            await crear(payload)
            toast.success('Tratamiento registrado correctamente')
          }
        }}
      />

      {/* Confirmación de eliminación (HU-28 / RF-43) */}
      <AlertDialog
        open={Boolean(tratamientoAEliminar)}
        onOpenChange={(next) => {
          if (!eliminando && !next) setTratamientoAEliminar(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-extrabold text-primary">
              Eliminar tratamiento
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tratamientoAEliminar && (
                <>
                  ¿Seguro que querés eliminar el tratamiento del{' '}
                  <strong className="text-foreground">
                    {formatearFechaHora(tratamientoAEliminar.fecha)}
                  </strong>
                  ? Esta acción no se puede deshacer.
                  {tratamientoAEliminar.esUltimo &&
                    ' Al ser el tratamiento vigente, el registro anterior (si existe) pasará a figurar como vigente.'}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg" className="h-10 px-4" disabled={eliminando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              size="lg"
              className="h-10 px-4"
              disabled={eliminando}
              onClick={(e) => {
                e.preventDefault()
                void confirmarEliminacion()
              }}
            >
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
