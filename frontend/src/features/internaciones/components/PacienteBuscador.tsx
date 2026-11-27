import { useEffect, useId, useRef, useState } from 'react'
import { PlusIcon, SearchIcon, UserIcon, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  buscarPacientesRequest,
  type PacienteResumenDto,
  type PaginatedListOfPacienteResumenDto,
} from '../api/internacionesApi'

export interface PacienteSeleccionado {
  id: string
  nombre: string
  apellido: string
  dni: string
  edad: number
  sexo: PacienteResumenDto['sexo']
}

interface PacienteBuscadorProps {
  seleccionado: PacienteSeleccionado | null
  bloqueado?: boolean
  error?: string
  onSeleccionar: (paciente: PacienteSeleccionado | null) => void
  onSolicitarNuevoPaciente?: (busquedaActual: string) => void
}

/** Selector buscable de pacientes desde el padrón (RF-47). */
export function PacienteBuscador({
  seleccionado,
  bloqueado = false,
  error,
  onSeleccionar,
  onSolicitarNuevoPaciente,
}: PacienteBuscadorProps) {
  const inputId = useId()
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 250)

  const query = useApiQuery<PaginatedListOfPacienteResumenDto>(
    buscarPacientesRequest(busquedaDebounced),
    { enabled: !seleccionado && abierto },
  )

  useEffect(() => {
    const alClickFuera = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', alClickFuera)
    return () => document.removeEventListener('mousedown', alClickFuera)
  }, [])

  const resultados = query.data?.items ?? []

  const solicitarAltaRapida = () => {
    setAbierto(false)
    onSolicitarNuevoPaciente?.(busqueda.trim())
  }

  return (
    <Field ref={containerRef} data-invalid={error ? true : undefined} className="relative gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FieldLabel htmlFor={inputId}>
          Paciente <span className="text-destructive">*</span>
        </FieldLabel>
        {!seleccionado && !bloqueado && onSolicitarNuevoPaciente && (
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto gap-1 p-0 text-xs font-semibold text-brand"
            onClick={solicitarAltaRapida}
          >
            <PlusIcon className="size-3.5" strokeWidth={2.5} />
            <span>Nuevo paciente</span>
          </Button>
        )}
      </div>

      {seleccionado ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/35 px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {seleccionado.apellido}, {seleccionado.nombre}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="rounded bg-primary/10 px-1.5 py-0 font-mono text-[11px] font-semibold text-primary"
                >
                  DNI {seleccionado.dni}
                </Badge>
                <span>{seleccionado.edad} años</span>
                <span>• {seleccionado.sexo}</span>
              </div>
            </div>
          </div>

          {!bloqueado && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                onSeleccionar(null)
                setBusqueda('')
                setAbierto(true)
              }}
            >
              <XIcon className="size-3.5" />
              <span>Cambiar</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={inputId}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Buscar paciente por DNI, apellido o nombre…"
            value={busqueda}
            onFocus={() => setAbierto(true)}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setAbierto(true)
            }}
            aria-invalid={error ? true : undefined}
            className="h-10 bg-card pl-9"
          />

          {abierto && (
            <ul
              role="listbox"
              aria-label="Resultados de pacientes"
              className="absolute inset-x-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md"
            >
              {query.error ? (
                <li className="px-3 py-2.5 text-center text-xs text-destructive">{query.error}</li>
              ) : query.cargando && resultados.length === 0 ? (
                <li className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                  Buscando pacientes…
                </li>
              ) : resultados.length > 0 ? (
                <>
                  {!busquedaDebounced && (
                    <li
                      role="presentation"
                      className="border-b px-3 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      Últimos pacientes registrados
                    </li>
                  )}
                  {resultados.map((p) => {
                    const yaInternado = Boolean(p.internacionActivaId)
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          disabled={yaInternado}
                          title={
                            yaInternado
                              ? 'Este paciente ya tiene una internación activa'
                              : undefined
                          }
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-inherit"
                          onClick={() => {
                            if (yaInternado) return
                            onSeleccionar({
                              id: p.id,
                              nombre: p.nombre,
                              apellido: p.apellido,
                              dni: p.dni,
                              edad: p.edad,
                              sexo: p.sexo,
                            })
                            setAbierto(false)
                          }}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate font-semibold">
                              {p.apellido}, {p.nombre}
                            </span>
                            {yaInternado && (
                              <Badge
                                variant="secondary"
                                className="shrink-0 bg-amber-100 px-1.5 py-0 text-[11px] font-semibold text-amber-900"
                              >
                                Ya internado
                              </Badge>
                            )}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                            DNI {p.dni} • {p.edad} años
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </>
              ) : (
                <li className="flex flex-col items-center gap-2 px-3 py-3 text-center text-xs text-muted-foreground">
                  <span>
                    {busquedaDebounced
                      ? 'No se encontraron pacientes'
                      : 'No hay pacientes recientes disponibles para internar'}
                  </span>
                  {onSolicitarNuevoPaciente && (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="border-brand/30 font-semibold text-brand hover:bg-brand/5 hover:text-brand"
                      onClick={solicitarAltaRapida}
                    >
                      <PlusIcon className="size-3.5" strokeWidth={2.5} />
                      <span>
                        {busqueda.trim()
                          ? `Registrar "${busqueda.trim()}" como paciente nuevo`
                          : 'Registrar paciente nuevo'}
                      </span>
                    </Button>
                  )}
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
