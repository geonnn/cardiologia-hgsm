import { useState } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  PlusIcon,
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
import { formatearFechaHora } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import { useEvolucionesInternacion } from '../hooks/useEvolucionesInternacion'
import { NuevaEvolucionDialog } from './NuevaEvolucionDialog'

const SELECT_CLASS =
  'h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface EvolucionesInternacionPanelProps {
  internacionId: string
  estaActiva: boolean
}

/** Listado cronológico, filtrado temporal y registro de notas de evolución clínica (HU-23, HU-24). */
export function EvolucionesInternacionPanel({
  internacionId,
  estaActiva,
}: EvolucionesInternacionPanelProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

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
    evoluciones,
    totalCount,
    totalPages,
    cargandoInicial,
    actualizando,
    error,
    recargar,
    crear,
  } = useEvolucionesInternacion(internacionId)

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de controles (RF-38, RF-39.1, RF-39.2) */}
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-wrap items-end justify-between gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="evol-desde" className="text-xs font-semibold text-primary">
                Fecha desde
              </label>
              <Input
                id="evol-desde"
                type="date"
                max={fechaHasta || undefined}
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="evol-hasta" className="text-xs font-semibold text-primary">
                Fecha hasta
              </label>
              <Input
                id="evol-hasta"
                type="date"
                min={fechaDesde || undefined}
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-9 w-40 bg-card text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="evol-orden" className="text-xs font-semibold text-primary">
                Orden
              </label>
              <select
                id="evol-orden"
                className={SELECT_CLASS}
                value={ascendente ? 'asc' : 'desc'}
                onChange={(e) => setAscendente(e.target.value === 'asc')}
              >
                <option value="desc">Más reciente primero</option>
                <option value="asc">Más antigua primero</option>
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
                <span>Nueva evolución</span>
              </Button>
            ) : (
              <Badge variant="outline" className="h-8 px-2.5 text-xs font-medium text-muted-foreground">
                Internación finalizada · solo lectura
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listado de evoluciones */}
      <div
        aria-busy={actualizando}
        className={cn('flex flex-col gap-3 transition-opacity', actualizando && 'opacity-60')}
      >
        {error ? (
          <Empty className="border-2 border-dashed bg-card py-10">
            <EmptyHeader>
              <EmptyTitle className="font-extrabold">
                No se pudieron cargar las evoluciones
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
        ) : evoluciones.length === 0 ? (
          <Empty className="border-2 border-dashed bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle className="font-extrabold">
                {tieneFiltrosActivos
                  ? 'No hay evoluciones para el período seleccionado'
                  : 'Sin evoluciones registradas'}
              </EmptyTitle>
              <EmptyDescription>
                {tieneFiltrosActivos
                  ? 'Probá ampliando o limpiando el rango de fechas.'
                  : estaActiva
                    ? 'Registrá notas diarias de evolución clínica para documentar el curso de la internación.'
                    : 'No se registraron notas de evolución durante esta internación.'}
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
                  <span>Nueva evolución</span>
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {evoluciones.map((item) => (
                <Card key={item.id} className="gap-0 border-l-4 border-l-primary/50 py-0">
                  <CardContent className="flex flex-col gap-2.5 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary tabular-nums"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span>{formatearFechaHora(item.fecha)}</span>
                      </Badge>
                    </div>

                    <p className="min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                      {item.detalle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
                <span>
                  Total: <strong className="text-foreground">{totalCount}</strong>{' '}
                  {totalCount === 1 ? 'evolución' : 'evoluciones'} (Página {page} de {totalPages})
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
      <NuevaEvolucionDialog
        open={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        onGuardar={async (payload) => {
          await crear(payload)
          toast.success('Evolución registrada correctamente')
        }}
      />
    </div>
  )
}
