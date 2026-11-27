import type { ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ClipboardListIcon, EyeIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatearFecha } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import type { PacienteResumen } from '../api/pacientesApi'

interface PacientesTablaProps {
  pacientes: ReadonlyArray<PacienteResumen>
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  onVerFicha: (paciente: PacienteResumen) => void
  onVerInternacion: (internacionId: string) => void
  empty?: ReactNode
}

/** Tabla paginada del padrón de pacientes (RF-26). */
export function PacientesTabla({
  pacientes,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onVerFicha,
  onVerInternacion,
  empty,
}: PacientesTablaProps) {
  if (pacientes.length === 0) return <>{empty}</>

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/70 text-xs font-semibold tracking-wide text-primary uppercase">
              <th className="px-4 py-3 whitespace-nowrap">DNI</th>
              <th className="px-4 py-3 whitespace-nowrap">Apellido y Nombre</th>
              <th className="px-4 py-3 whitespace-nowrap">Sexo</th>
              <th className="px-4 py-3 whitespace-nowrap">Edad</th>
              <th className="px-4 py-3 whitespace-nowrap">F. Registro</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pacientes.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-muted/35">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-primary/10 px-2 font-mono text-xs font-semibold text-primary"
                  >
                    {p.dni}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">
                  {p.apellido}, {p.nombre}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'font-semibold',
                      p.sexo === 'Femenino'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-sky-100 text-sky-800',
                    )}
                  >
                    {p.sexo}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">{p.edad} años</td>
                <td className="px-4 py-3 whitespace-nowrap tabular-nums text-muted-foreground">
                  {p.fechaCarga ? formatearFecha(p.fechaCarga) : '—'}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    {p.internacionActivaId && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="font-semibold"
                        onClick={() => {
                          if (p.internacionActivaId) onVerInternacion(p.internacionActivaId)
                        }}
                        title="Ver ficha de la internación activa"
                      >
                        <ClipboardListIcon className="size-3.5" />
                        <span>Ver internación activa</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onVerFicha(p)}
                      title="Ver historia clínica"
                    >
                      <EyeIcon className="size-3.5" />
                      <span>Ficha</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie de paginación */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <span>
          Total: <strong className="text-foreground">{totalCount}</strong>{' '}
          {totalCount === 1 ? 'paciente' : 'pacientes'} (Página {page} de {totalPages})
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeftIcon className="size-4" />
            <span>Anterior</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <span>Siguiente</span>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** Filas skeleton mientras se cargan los pacientes por primera vez. */
export function PacientesTablaSkeleton({ filas = 6 }: { filas?: number }) {
  return (
    <Card className="gap-0 overflow-hidden py-0" aria-hidden="true">
      <div className="divide-y">
        {Array.from({ length: filas }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            <div
              className="h-4 flex-1 animate-pulse rounded bg-muted"
              style={{ maxWidth: `${35 + ((i * 19) % 35)}%` }}
            />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-7 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </Card>
  )
}
