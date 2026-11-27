import { useState } from 'react'
import {
  CalendarIcon,
  CheckCircle2Icon,
  CheckIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  RotateCcwIcon,
} from 'lucide-react'
import { toast } from 'sonner'
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
import type { Pendiente } from '../api/internacionesApi'
import {
  usePendientesInternacion,
  type FiltroEstadoPendiente,
} from '../hooks/usePendientesInternacion'
import { NuevoPendienteDialog } from './NuevoPendienteDialog'

const SELECT_CLASS =
  'h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface PendientesInternacionPanelProps {
  internacionId: string
  estaActiva: boolean
}

/** Listado, alta y marcado/desmarcado de pendientes asistenciales de una internación (HU-32 a HU-34). */
export function PendientesInternacionPanel({
  internacionId,
  estaActiva,
}: PendientesInternacionPanelProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  const {
    page,
    setPage,
    estado,
    setEstado,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    ascendente,
    setAscendente,
    limpiarFiltros,
    tieneFiltrosActivos,
    pendientes,
    totalCount,
    totalPages,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    agregar,
    marcarRealizado,
    desmarcarRealizado,
    estaProcesando,
  } = usePendientesInternacion(internacionId)

  const handleDesmarcar = async (item: Pendiente) => {
    try {
      await desmarcarRealizado(item.id)
      toast.success(`"${item.titulo}" volvió a estado no realizado`)
    } catch (err: unknown) {
      toast.error(mensajeDeError(err))
    }
  }

  const handleMarcarRealizado = async (item: Pendiente) => {
    try {
      await marcarRealizado(item.id)
      toast.success(`"${item.titulo}" marcado como realizado`, {
        action: {
          label: 'Deshacer',
          onClick: () => {
            void handleDesmarcar(item)
          },
        },
      })
    } catch (err: unknown) {
      toast.error(mensajeDeError(err))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de filtros y acción principal (RF-44, RF-45.1, RF-45.2) */}
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-wrap items-end justify-between gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="pend-estado" className="text-xs font-semibold text-primary">
                Estado
              </label>
              <select
                id="pend-estado"
                className={SELECT_CLASS}
                value={estado}
                onChange={(e) => setEstado(e.target.value as FiltroEstadoPendiente)}
              >
                <option value="todos">Todos</option>
                <option value="pendientes">No realizados</option>
                <option value="realizados">Realizados</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pend-desde" className="text-xs font-semibold text-primary">
                Carga desde
              </label>
              <Input
                id="pend-desde"
                type="date"
                max={fechaHasta || undefined}
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pend-hasta" className="text-xs font-semibold text-primary">
                Carga hasta
              </label>
              <Input
                id="pend-hasta"
                type="date"
                min={fechaDesde || undefined}
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pend-orden" className="text-xs font-semibold text-primary">
                Orden
              </label>
              <select
                id="pend-orden"
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
                onClick={() => setDialogoAbierto(true)}
              >
                <PlusIcon className="size-4" strokeWidth={2.5} />
                <span>Nuevo pendiente</span>
              </Button>
            ) : (
              <Badge variant="outline" className="h-8 px-2.5 text-xs font-medium text-muted-foreground">
                Internación finalizada · solo lectura
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listado de pendientes */}
      <div
        aria-busy={actualizando}
        className={cn('flex flex-col gap-3 transition-opacity', actualizando && 'opacity-60')}
      >
        {error ? (
          <Empty className="border-2 border-dashed bg-card py-10">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                No se pudieron cargar los pendientes
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
        ) : pendientes.length === 0 ? (
          <Empty className="border-2 border-dashed bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckSquareIcon />
              </EmptyMedia>
              <EmptyTitle className="font-extrabold">
                {tieneFiltrosActivos
                  ? 'No hay pendientes con los filtros aplicados'
                  : 'Sin pendientes registrados'}
              </EmptyTitle>
              <EmptyDescription>
                {tieneFiltrosActivos
                  ? 'Probá cambiando el estado o limpiando el rango de fechas.'
                  : estaActiva
                    ? 'Registrá estudios, interconsultas o tareas asistenciales para hacer seguimiento durante la internación.'
                    : 'No se registraron pendientes asistenciales durante esta internación.'}
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
                  onClick={() => setDialogoAbierto(true)}
                >
                  <PlusIcon className="size-4" strokeWidth={2.5} />
                  <span>Nuevo pendiente</span>
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {pendientes.map((item) => {
                const procesando = estaProcesando(item.id)
                return (
                  <Card
                    key={item.id}
                    className={cn(
                      'gap-0 border-l-4 py-0 transition-colors',
                      item.estaRealizado
                        ? 'border-l-emerald-500/70 bg-muted/20'
                        : 'border-amber-200/80 border-l-amber-500 bg-card shadow-xs',
                    )}
                  >
                    <CardContent className="flex flex-col gap-2.5 px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          {item.estaRealizado ? (
                            <Badge
                              variant="secondary"
                              className="inline-flex shrink-0 items-center gap-1 bg-emerald-100 font-semibold text-emerald-800"
                            >
                              <CheckCircle2Icon className="size-3.5" />
                              <span>Realizado</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="inline-flex shrink-0 items-center gap-1 bg-amber-100 font-semibold text-amber-900"
                            >
                              <ClockIcon className="size-3.5" />
                              <span>No realizado</span>
                            </Badge>
                          )}

                          <h3
                            className={cn(
                              'min-w-0 text-base font-bold break-words [overflow-wrap:anywhere]',
                              item.estaRealizado ? 'text-foreground/80' : 'text-primary',
                            )}
                          >
                            {item.titulo}
                          </h3>
                        </div>

                        {estaActiva && (
                          item.estaRealizado ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="shrink-0 text-muted-foreground hover:text-foreground"
                              disabled={procesando}
                              onClick={() => void handleDesmarcar(item)}
                            >
                              <RotateCcwIcon className="size-3.5" />
                              <span>{procesando ? 'Revirtiendo…' : 'Desmarcar'}</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="brand"
                              size="sm"
                              className="shrink-0 font-semibold"
                              disabled={procesando}
                              onClick={() => void handleMarcarRealizado(item)}
                            >
                              <CheckIcon className="size-4" />
                              <span>{procesando ? 'Marcando…' : 'Marcar realizado'}</span>
                            </Button>
                          )
                        )}
                      </div>

                      <p
                        className={cn(
                          'min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]',
                          item.estaRealizado ? 'text-muted-foreground' : 'text-foreground',
                        )}
                      >
                        {item.descripcion}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="size-3.5" />
                          <span>
                            Cargado:{' '}
                            <strong className="text-foreground/85">
                              {formatearFechaHora(item.fechaCarga)}
                            </strong>
                          </span>
                        </span>

                        {item.estaRealizado && item.fechaResolucion && (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                            <span>
                              Resuelto:{' '}
                              <strong className="text-foreground/85">
                                {formatearFechaHora(item.fechaResolucion)}
                              </strong>
                            </span>
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
                <span>
                  Total: <strong className="text-foreground">{totalCount}</strong>{' '}
                  {totalCount === 1 ? 'pendiente' : 'pendientes'} (Página {page} de {totalPages})
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

      {/* Modal de creación */}
      <NuevoPendienteDialog
        open={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        onGuardar={async (payload) => {
          await agregar(payload)
          toast.success('Pendiente agregado correctamente')
        }}
      />
    </div>
  )
}
