import { FilterIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { FactorDeRiesgo, MotivoInternacion } from '../api/catalogosApi'
import type { PacienteOrden, Sexo } from '../api/pacientesApi'
import type { EstadoInternacionFiltro } from '../hooks/usePacientes'
import { CatalogoCombobox } from './CatalogoCombobox'

const SEXO_TODOS = '__todos__'

const OPCIONES_ESTADO_INTERNACION: ReadonlyArray<{
  value: EstadoInternacionFiltro
  label: string
}> = [
  { value: 'todos', label: 'Todos' },
  { value: 'activos', label: 'Internados' },
  { value: 'sin_activa', label: 'Sin activa' },
]

interface PacientesFiltrosProps {
  busqueda: string
  onBusquedaChange: (valor: string) => void
  estadoInternacion: EstadoInternacionFiltro
  onEstadoInternacionChange: (valor: EstadoInternacionFiltro) => void
  ordenarPor: PacienteOrden
  onOrdenarPorChange: (valor: PacienteOrden) => void
  descendente: boolean
  onDescendenteChange: (valor: boolean) => void
  motivos: ReadonlyArray<MotivoInternacion>
  motivoId: number | undefined
  onMotivoChange: (valor: number | undefined) => void
  factores: ReadonlyArray<FactorDeRiesgo>
  factorId: number | undefined
  onFactorChange: (valor: number | undefined) => void
  sexo: Sexo | ''
  onSexoChange: (valor: Sexo | '') => void
  fechaCargaDesde: string
  onFechaCargaDesdeChange: (valor: string) => void
  fechaCargaHasta: string
  onFechaCargaHastaChange: (valor: string) => void
  tieneFiltrosActivos: boolean
  onLimpiar: () => void
}

/** Panel de búsqueda, filtros y ordenamiento de pacientes (RF-26.1, RF-26.2, RF-26.3). */
export function PacientesFiltros({
  busqueda,
  onBusquedaChange,
  estadoInternacion,
  onEstadoInternacionChange,
  ordenarPor,
  onOrdenarPorChange,
  descendente,
  onDescendenteChange,
  motivos,
  motivoId,
  onMotivoChange,
  factores,
  factorId,
  onFactorChange,
  sexo,
  onSexoChange,
  fechaCargaDesde,
  onFechaCargaDesdeChange,
  fechaCargaHasta,
  onFechaCargaHastaChange,
  tieneFiltrosActivos,
  onLimpiar,
}: PacientesFiltrosProps) {
  return (
    <search aria-label="Filtros de pacientes">
      <Card className="gap-4 py-4">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
            <FilterIcon className="size-4" />
            <span>Filtros y orden</span>
          </CardTitle>
          {tieneFiltrosActivos && (
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={onLimpiar}
              className="h-auto p-0 text-xs font-semibold text-brand"
            >
              Limpiar
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* 1. Búsqueda combinada (RF-26.3) */}
          <Field className="gap-1.5">
            <FieldLabel htmlFor="pacientes-busqueda" className="text-xs font-semibold text-primary">
              Buscar paciente
            </FieldLabel>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pacientes-busqueda"
                type="search"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="DNI, apellido o nombre"
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                className="h-9 bg-card pl-8 text-sm"
              />
            </div>
          </Field>

          {/* 2. Estado de internación */}
          <fieldset className="flex flex-col">
            <legend className="mb-1.5 text-xs leading-snug font-semibold text-primary">
              Estado de internación
            </legend>
            <div className="grid h-9 grid-cols-3 gap-0.5 rounded-lg border border-input bg-card p-0.5">
              {OPCIONES_ESTADO_INTERNACION.map((opcion) => {
                const activo = estadoInternacion === opcion.value
                return (
                  <label
                    key={opcion.value}
                    className={cn(
                      'relative flex h-full cursor-pointer items-center justify-center rounded-md px-1.5 text-xs transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50',
                      activo
                        ? 'bg-primary font-semibold text-primary-foreground shadow-xs'
                        : 'font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <input
                      type="radio"
                      name="estado-internacion"
                      value={opcion.value}
                      checked={activo}
                      onChange={() => onEstadoInternacionChange(opcion.value)}
                      className="sr-only"
                    />
                    <span className="truncate">{opcion.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

        {/* 2. Ordenamiento (RF-26.1) */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="pacientes-orden" className="text-xs font-semibold text-primary">
            Ordenar por
          </FieldLabel>
          <div className="flex flex-col gap-2">
            <Select
              value={ordenarPor}
              onValueChange={(v) => onOrdenarPorChange(v as PacienteOrden)}
            >
              <SelectTrigger id="pacientes-orden" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alfabetico">Alfabético (Apellido y Nombre)</SelectItem>
                <SelectItem value="FechaCarga">Fecha de registro</SelectItem>
                <SelectItem value="Edad">Edad</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={descendente ? 'desc' : 'asc'}
              onValueChange={(v) => onDescendenteChange(v === 'desc')}
            >
              <SelectTrigger aria-label="Dirección de ordenamiento" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Field>

        {/* 3. Motivo de internación (RF-26.2) */}
        <CatalogoCombobox
          label="Motivo de internación"
          placeholder="Buscar motivo…"
          options={motivos}
          value={motivoId}
          onChange={onMotivoChange}
        />

        {/* 4. Factor de riesgo cardiovascular (RF-26.2) */}
        <CatalogoCombobox
          label="Factor de riesgo"
          placeholder="Buscar factor…"
          options={factores}
          value={factorId}
          onChange={onFactorChange}
        />

        {/* 5. Sexo */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="pacientes-sexo" className="text-xs font-semibold text-primary">
            Sexo
          </FieldLabel>
          <Select
            value={sexo || SEXO_TODOS}
            onValueChange={(v) => onSexoChange(v === SEXO_TODOS ? '' : (v as Sexo))}
          >
            <SelectTrigger id="pacientes-sexo" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SEXO_TODOS}>Todos</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* 6. Rango de fecha de carga (RF-26.2) */}
        <Field className="gap-1.5">
          <FieldLabel className="text-xs font-semibold text-primary">
            Fecha de carga (registro)
          </FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Desde</span>
              <Input
                type="date"
                aria-label="Fecha de carga desde"
                value={fechaCargaDesde}
                onChange={(e) => onFechaCargaDesdeChange(e.target.value)}
                className="h-9 bg-card px-2 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Hasta</span>
              <Input
                type="date"
                aria-label="Fecha de carga hasta"
                value={fechaCargaHasta}
                onChange={(e) => onFechaCargaHastaChange(e.target.value)}
                className="h-9 bg-card px-2 text-xs"
              />
            </div>
          </div>
        </Field>
      </CardContent>
    </Card>
    </search>
  )
}
