import { useState } from 'react'
import { FilterIcon, PlusIcon, UsersIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PageTitle } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import { PacientesFiltros } from '../components/PacientesFiltros'
import { PacientesTabla, PacientesTablaSkeleton } from '../components/PacientesTabla'
import { usePacientes } from '../hooks/usePacientes'

/** Listado paginado, búsqueda, filtros y ordenamiento de pacientes (RF-26 / 26.1 / 26.2 / 26.3). */
export function PacientesPage() {
  const navigate = useNavigate()
  const [filtrosMobileAbiertos, setFiltrosMobileAbiertos] = useState(false)

  const {
    busqueda,
    setBusqueda,
    motivoId,
    setMotivoId,
    factorId,
    setFactorId,
    sexo,
    setSexo,
    fechaCargaDesde,
    setFechaCargaDesde,
    fechaCargaHasta,
    setFechaCargaHasta,
    ordenarPor,
    setOrdenarPor,
    descendente,
    setDescendente,
    page,
    setPage,
    limpiarFiltros,
    tieneFiltrosActivos,
    motivos,
    factores,
    catalogosError,
    pacientes,
    totalCount,
    totalPages,
    cargandoInicial,
    actualizando,
    error,
    recargar,
  } = usePacientes()

  const contenidoTabla = () => {
    if (error && pacientes.length === 0) {
      return (
        <Empty className="border-2 border-dashed bg-card">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se pudieron cargar los pacientes</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" size="lg" className="h-10 px-4" onClick={recargar}>
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      )
    }

    if (cargandoInicial) return <PacientesTablaSkeleton />

    return (
      <PacientesTabla
        pacientes={pacientes}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onVerFicha={(paciente) => navigate(`/pacientes/${paciente.id}`)}
        empty={
          <Empty className="border-2 border-dashed bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle className="font-extrabold">No se encontraron pacientes</EmptyTitle>
              <EmptyDescription>
                {tieneFiltrosActivos
                  ? 'Ajustá o limpiá los filtros aplicados para ver más resultados.'
                  : 'Registrá un nuevo paciente con el botón superior.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {tieneFiltrosActivos ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-10 px-4"
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  size="lg"
                  className="h-10 px-4"
                  onClick={() => navigate('/pacientes/nuevo')}
                >
                  <PlusIcon className="size-4" strokeWidth={2.5} />
                  <span>Nuevo paciente</span>
                </Button>
              )}
            </EmptyContent>
          </Empty>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Gestión de pacientes</PageTitle>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10 px-3 lg:hidden"
            onClick={() => setFiltrosMobileAbiertos((prev) => !prev)}
            aria-expanded={filtrosMobileAbiertos}
          >
            <FilterIcon className="size-4" />
            <span>Filtros</span>
            {tieneFiltrosActivos && (
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
            )}
          </Button>

          <Button
            type="button"
            variant="brand"
            size="lg"
            className="h-10 px-4 font-semibold"
            onClick={() => navigate('/pacientes/nuevo')}
          >
            <PlusIcon className="size-4" strokeWidth={2.5} />
            <span>Nuevo paciente</span>
          </Button>
        </div>
      </div>

      {error && pacientes.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={recargar}>
            Reintentar
          </Button>
        </div>
      )}

      {catalogosError && !error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudieron cargar los catálogos de filtro: {catalogosError}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className={cn(filtrosMobileAbiertos ? 'block' : 'hidden', 'lg:block')}>
          <PacientesFiltros
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            ordenarPor={ordenarPor}
            onOrdenarPorChange={setOrdenarPor}
            descendente={descendente}
            onDescendenteChange={setDescendente}
            motivos={motivos}
            motivoId={motivoId}
            onMotivoChange={setMotivoId}
            factores={factores}
            factorId={factorId}
            onFactorChange={setFactorId}
            sexo={sexo}
            onSexoChange={setSexo}
            fechaCargaDesde={fechaCargaDesde}
            onFechaCargaDesdeChange={setFechaCargaDesde}
            fechaCargaHasta={fechaCargaHasta}
            onFechaCargaHastaChange={setFechaCargaHasta}
            tieneFiltrosActivos={tieneFiltrosActivos}
            onLimpiar={limpiarFiltros}
          />
        </aside>

        <section
          aria-busy={actualizando}
          className={cn('min-w-0 transition-opacity', actualizando && 'opacity-60')}
        >
          {contenidoTabla()}
        </section>
      </div>
    </div>
  )
}
