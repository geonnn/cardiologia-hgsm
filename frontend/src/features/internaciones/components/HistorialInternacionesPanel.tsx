import {
  BedDoubleIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  EyeIcon,
  PlusIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatearFechaHora } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import { CONDICION_ALTA_POR_VALOR } from '../constants'
import { useInternacionesPaciente } from '../hooks/useInternacionesPaciente'

interface HistorialInternacionesPanelProps {
  pacienteId: string
  tieneInternacionActiva: boolean
  onNuevaInternacion: () => void
}

/** Historial paginado, ordenado y filtrable de internaciones de un paciente (HU-21 / RF-48). */
export function HistorialInternacionesPanel({
  pacienteId,
  tieneInternacionActiva,
  onNuevaInternacion,
}: HistorialInternacionesPanelProps) {
  const navigate = useNavigate()
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
    internaciones,
    totalCount,
    totalPages,
    cargandoInicial,
    actualizando,
    error,
    recargar,
  } = useInternacionesPaciente(pacienteId)

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de controles (RF-48.1 y RF-48.2) */}
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-wrap items-end justify-between gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="hist-int-desde" className="text-xs font-semibold text-primary">
                Ingreso desde
              </label>
              <Input
                id="hist-int-desde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="hist-int-hasta" className="text-xs font-semibold text-primary">
                Ingreso hasta
              </label>
              <Input
                id="hist-int-hasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="hist-int-orden" className="text-xs font-semibold text-primary">
                Orden
              </label>
              <Select
                value={ascendente ? 'asc' : 'desc'}
                onValueChange={(v) => setAscendente(v === 'asc')}
              >
                <SelectTrigger id="hist-int-orden" size="sm" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Más reciente primero</SelectItem>
                  <SelectItem value="asc">Más antigua primero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tieneFiltrosActivos && (
              <Button type="button" variant="outline" size="sm" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            )}
            {!tieneInternacionActiva && (
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="font-semibold"
                onClick={onNuevaInternacion}
              >
                <PlusIcon className="size-4" strokeWidth={2.5} />
                <span>Nueva internación</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contenido */}
      <div
        aria-busy={actualizando}
        className={cn('flex flex-col gap-3 transition-opacity', actualizando && 'opacity-60')}
      >
        {error ? (
          <Empty className="border-2 border-dashed bg-card py-10">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                No se pudo cargar el historial de internaciones
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
            <Card className="h-20 animate-pulse bg-muted/40" />
            <Card className="h-20 animate-pulse bg-muted/40" />
          </div>
        ) : internaciones.length === 0 ? (
          <Empty className="border-2 border-dashed bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardListIcon />
              </EmptyMedia>
              <EmptyTitle className="font-extrabold">
                {tieneFiltrosActivos
                  ? 'No hay internaciones para el período seleccionado'
                  : 'Sin internaciones registradas'}
              </EmptyTitle>
              <EmptyDescription>
                {tieneFiltrosActivos
                  ? 'Probá ampliando o limpiando el rango de fechas.'
                  : 'Este paciente no registra internaciones previas ni una internación activa.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {tieneFiltrosActivos ? (
                <Button type="button" variant="outline" size="lg" className="h-10 px-4" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              ) : !tieneInternacionActiva ? (
                <Button
                  type="button"
                  variant="brand"
                  size="lg"
                  className="h-10 px-4 font-semibold"
                  onClick={onNuevaInternacion}
                >
                  <PlusIcon className="size-4" strokeWidth={2.5} />
                  <span>Nueva internación</span>
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {internaciones.map((item) => {
                const condicion = item.condicionAlta
                  ? CONDICION_ALTA_POR_VALOR[item.condicionAlta]
                  : null
                return (
                  <Card
                    key={item.id}
                    className={cn(
                      'gap-0 py-0',
                      item.estaActiva && 'border-primary/35 ring-1 ring-primary/15',
                    )}
                  >
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {item.estaActiva ? (
                            <Badge className="bg-emerald-600 font-semibold text-white">
                              En curso
                            </Badge>
                          ) : (
                            condicion && (
                              <Badge
                                variant="secondary"
                                className={cn('font-semibold', condicion.badgeClass)}
                              >
                                {condicion.label}
                              </Badge>
                            )
                          )}
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                            <BedDoubleIcon className="size-4" />
                            <span>
                              {item.cama.sector} #{item.cama.numeroCama}
                            </span>
                          </span>
                          <Badge variant="outline" className="text-xs font-semibold">
                            Manejo {item.manejo}
                          </Badge>
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                            <CalendarIcon className="size-3.5" />
                            <span>
                              Ingreso:{' '}
                              <strong className="text-foreground">
                                {formatearFechaHora(item.fechaInternacion)}
                              </strong>
                            </span>
                          </span>
                          {item.fechaFin && (
                            <span className="text-xs text-muted-foreground tabular-nums">
                              Egreso:{' '}
                              <strong className="text-foreground">
                                {formatearFechaHora(item.fechaFin)}
                              </strong>
                            </span>
                          )}
                        </div>

                        {item.motivosInternacion.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.motivosInternacion.map((m) => (
                              <Badge
                                key={m.id}
                                variant="secondary"
                                className="border border-primary/15 bg-primary/10 text-xs font-semibold text-primary"
                              >
                                {m.nombre}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => navigate(`/internaciones/${item.id}`)}
                      >
                        <EyeIcon className="size-3.5" />
                        <span>Ver internación</span>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
                <span>
                  Total: <strong className="text-foreground">{totalCount}</strong>{' '}
                  {totalCount === 1 ? 'internación' : 'internaciones'} (Página {page} de{' '}
                  {totalPages})
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
    </div>
  )
}
