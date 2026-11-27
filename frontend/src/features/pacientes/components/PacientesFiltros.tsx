import { FilterIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FactorDeRiesgo, MotivoInternacion } from '../api/catalogosApi'
import type { PacienteOrden, Sexo } from '../api/pacientesApi'
import { CatalogoCombobox } from './CatalogoCombobox'

const SELECT_CLASS =
  'h-9 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface PacientesFiltrosProps {
  busqueda: string
  onBusquedaChange: (valor: string) => void
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
              type="text"
              placeholder="DNI, apellido o nombre"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="h-9 bg-card pl-8 text-sm"
            />
          </div>
        </Field>

        {/* 2. Ordenamiento (RF-26.1) */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="pacientes-orden" className="text-xs font-semibold text-primary">
            Ordenar por
          </FieldLabel>
          <div className="flex flex-col gap-2">
            <select
              id="pacientes-orden"
              className={SELECT_CLASS}
              value={ordenarPor}
              onChange={(e) => onOrdenarPorChange(e.target.value as PacienteOrden)}
            >
              <option value="Alfabetico">Alfabético (Apellido y Nombre)</option>
              <option value="FechaCarga">Fecha de registro</option>
              <option value="Edad">Edad</option>
            </select>
            <select
              aria-label="Dirección de ordenamiento"
              className={SELECT_CLASS}
              value={descendente ? 'desc' : 'asc'}
              onChange={(e) => onDescendenteChange(e.target.value === 'desc')}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
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
          <select
            id="pacientes-sexo"
            className={SELECT_CLASS}
            value={sexo}
            onChange={(e) => onSexoChange(e.target.value as Sexo | '')}
          >
            <option value="">Todos</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
          </select>
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
  )
}
