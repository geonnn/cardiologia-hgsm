import { useState } from 'react'
import {
  ActivityIcon,
  ArrowRightIcon,
  BedDoubleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { PageTitle } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { DashboardSlotCard } from '../components/DashboardSlotCard'
import { useDashboard, type ResumenSector } from '../hooks/useDashboard'

const formatearFechaHoy = () =>
  new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

/** Página de inicio (`/`) con plantilla modular de dashboard e indicadores vivos del servicio. */
export function InicioPage() {
  const navigate = useNavigate()
  const [fechaHoy] = useState(formatearFechaHoy)

  const {
    uco,
    sala,
    camasHabilitadas,
    camasOcupadas,
    camasDisponibles,
    camasAislamiento,
    camasDeshabilitadas,
    porcentajeOcupacion,
    internacionesMayorEstadia,
    totalPacientes,
    pacientesRecientes,
    cargandoInicial,
    actualizando,
    errorCamas,
    errorPacientes,
    recargar,
  } = useDashboard()

  const hayError = Boolean(errorCamas || errorPacientes)

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      {/* Encabezado y accesos rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <PageTitle>Servicio de cardiología</PageTitle>
          <p className="text-sm text-muted-foreground capitalize">
            {fechaHoy}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3"
            onClick={recargar}
            disabled={actualizando}
          >
            <RefreshCwIcon className={cn('size-4', actualizando && 'animate-spin')} />
            <span>Actualizar</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3"
            onClick={() => navigate('/pacientes/nuevo')}
          >
            <UserPlusIcon className="size-4" />
            <span>Nuevo paciente</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-9 px-3.5 font-semibold"
            onClick={() => navigate('/camas')}
          >
            <BedDoubleIcon className="size-4" />
            <span>Ver mapa de camas</span>
          </Button>
        </div>
      </div>

      {hayError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          <span>
            No se pudieron actualizar algunos datos del tablero:{' '}
            {errorCamas ?? errorPacientes}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={recargar}>
            Reintentar
          </Button>
        </div>
      )}

      {/* 1. Tarjetas KPI principales */}
      {cargandoInicial ? (
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="h-24 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : (
        <section
          aria-label="Indicadores principales del servicio"
          aria-busy={actualizando}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 transition-opacity',
            actualizando && 'opacity-70',
          )}
        >
          <Card className="gap-2 py-3">
            <CardContent className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Ocupación general
                </span>
                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ActivityIcon className="size-3.5" />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl leading-none font-extrabold tracking-tight text-foreground tabular-nums">
                  {camasOcupadas}{' '}
                  <span className="text-sm font-semibold text-muted-foreground">
                    / {camasHabilitadas}
                  </span>
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    'font-bold tabular-nums',
                    porcentajeOcupacion >= 85
                      ? 'bg-estado-ocupada text-estado-ocupada-ink'
                      : 'bg-primary/10 text-primary',
                  )}
                >
                  {porcentajeOcupacion}%
                </Badge>
              </div>
              <div
                role="progressbar"
                aria-label="Porcentaje de ocupación general"
                aria-valuenow={porcentajeOcupacion}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1.5 w-full overflow-clip rounded-full bg-muted"
              >
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    porcentajeOcupacion >= 85 ? 'bg-brand' : 'bg-primary',
                  )}
                  style={{ width: `${porcentajeOcupacion}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 py-3">
            <CardContent className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Camas disponibles
                </span>
                <span className="grid size-7 place-items-center rounded-lg bg-estado-disponible text-estado-disponible-ink">
                  <CheckCircle2Icon className="size-3.5" />
                </span>
              </div>
              <span className="text-2xl leading-none font-extrabold tracking-tight text-foreground tabular-nums">
                {camasDisponibles}
              </span>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">{uco.disponibles}</strong> en UCO ·{' '}
                <strong className="text-foreground">{sala.disponibles}</strong> en Sala
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 py-3">
            <CardContent className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  En aislamiento
                </span>
                <span className="grid size-7 place-items-center rounded-lg bg-estado-aislamiento text-estado-aislamiento-ink">
                  <ShieldAlertIcon className="size-3.5" />
                </span>
              </div>
              <span className="text-2xl leading-none font-extrabold tracking-tight text-foreground tabular-nums">
                {camasAislamiento}
              </span>
              <p className="text-xs text-muted-foreground">
                {camasDeshabilitadas > 0
                  ? `${camasDeshabilitadas} ${camasDeshabilitadas === 1 ? 'cama deshabilitada' : 'camas deshabilitadas'}`
                  : 'Todas las demás camas operativas'}
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 py-3">
            <CardContent className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Pacientes en padrón
                </span>
                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon className="size-3.5" />
                </span>
              </div>
              <span className="text-2xl leading-none font-extrabold tracking-tight text-foreground tabular-nums">
                {totalPacientes}
              </span>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">{camasOcupadas}</strong> con internación activa
                hoy
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 2. Cuerpo del dashboard: estado por sector + paneles operativos y espacio de pendientes */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        {/* Columna principal izquierda */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
          {/* Ocupación por sector (UCO y Sala) */}
          <Card className="gap-3 py-3.5">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-2.5">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
                <BedDoubleIcon className="size-4" />
                <span>Estado de camas por sector</span>
              </CardTitle>
              <Link
                to="/camas"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Ir a camas</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cargandoInicial ? (
                <>
                  <div className="h-28 animate-pulse rounded-xl bg-muted/40" />
                  <div className="h-28 animate-pulse rounded-xl bg-muted/40" />
                </>
              ) : (
                <>
                  <SectorResumenCard resumen={uco} titulo="Unidad coronaria (UCO)" />
                  <SectorResumenCard resumen={sala} titulo="Sala" />
                </>
              )}
            </CardContent>
          </Card>

          {/* Internaciones activas con mayor estadía */}
          <Card className="flex-1 gap-2 py-3.5">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-2.5">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
                <ClockIcon className="size-4" />
                <span>Internaciones activas de mayor estadía</span>
              </CardTitle>
              <Link
                to="/camas"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Ver todas</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {cargandoInicial ? (
                <div className="flex flex-col gap-2" aria-hidden="true">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/40" />
                  ))}
                </div>
              ) : internacionesMayorEstadia.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No hay pacientes internados actualmente.
                </p>
              ) : (
                <ul className="divide-y">
                  {internacionesMayorEstadia.map((item) => (
                    <li key={item.internacionId}>
                      <Link
                        to={`/internaciones/${item.internacionId}`}
                        className="flex flex-wrap items-center justify-between gap-2 py-2 transition-colors hover:bg-muted/35 sm:-mx-2 sm:rounded-lg sm:px-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {item.nombreCompleto}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 px-1.5 py-0 text-[11px] font-semibold text-primary"
                            >
                              {item.sector} #{item.numeroCama}
                            </Badge>
                          </div>
                          {item.motivos.length > 0 && (
                            <p className="truncate text-xs text-muted-foreground">
                              {item.motivos.join(' · ')}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 font-semibold tabular-nums"
                        >
                          {item.diasInternado === 0
                            ? 'Ingreso hoy'
                            : item.diasInternado === 1
                              ? '1 día'
                              : `${item.diasInternado} días`}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: últimos pacientes + todo el sector inferior reservado para pendientes */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
          {/* Últimos pacientes registrados */}
          <Card className="gap-2 py-3.5">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-2.5">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
                <UsersIcon className="size-4" />
                <span>Últimos pacientes registrados</span>
              </CardTitle>
              <Link
                to="/pacientes"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Ver padrón</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {cargandoInicial ? (
                <div className="flex flex-col gap-2" aria-hidden="true">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/40" />
                  ))}
                </div>
              ) : pacientesRecientes.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Todavía no hay pacientes cargados en el sistema.
                </p>
              ) : (
                <ul className="divide-y">
                  {pacientesRecientes.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/pacientes/${p.id}`}
                          className="block truncate text-sm font-semibold text-foreground hover:text-primary hover:underline"
                        >
                          {p.apellido}, {p.nombre}
                        </Link>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          DNI {p.dni} · {p.edad} años
                        </p>
                      </div>
                      {p.internacionActivaId ? (
                        <Button
                          type="button"
                          variant="default"
                          size="xs"
                          className="shrink-0 font-semibold"
                          onClick={() => navigate(`/internaciones/${p.internacionActivaId}`)}
                        >
                          Ver internación
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="shrink-0"
                          onClick={() => navigate(`/pacientes/${p.id}`)}
                        >
                          Ver ficha
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Todo el sector inferior derecho dedicado a listar pendientes */}
          <DashboardSlotCard
            titulo="Pendientes"
            icon={ClipboardListIcon}
            descripcion="Sector reservado para listar las tareas y estudios pendientes sin resolver de los pacientes internados."
            className="min-h-40 flex-1"
          />
        </div>
      </div>
    </div>
  )
}

function SectorResumenCard({ resumen, titulo }: { resumen: ResumenSector; titulo: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-foreground">{titulo}</h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {resumen.ocupadas} de {resumen.habilitadas} camas habilitadas ocupadas
          </p>
        </div>
        <span className="text-sm font-extrabold text-primary tabular-nums">
          {resumen.porcentajeOcupacion}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Ocupación de ${titulo}`}
        aria-valuenow={resumen.porcentajeOcupacion}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-clip rounded-full bg-muted"
      >
        <div
          className={cn(
            'h-full rounded-full transition-all',
            resumen.porcentajeOcupacion >= 85 ? 'bg-brand' : 'bg-primary',
          )}
          style={{ width: `${resumen.porcentajeOcupacion}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-estado-ocupada ring-1 ring-black/15" />
          Ocupadas: <strong className="text-foreground tabular-nums">{resumen.ocupadas}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-estado-disponible ring-1 ring-black/15" />
          Libres: <strong className="text-foreground tabular-nums">{resumen.disponibles}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-estado-aislamiento ring-1 ring-black/15" />
          Aislamiento:{' '}
          <strong className="text-foreground tabular-nums">{resumen.aislamiento}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-estado-deshabilitada ring-1 ring-black/15" />
          Deshab.:{' '}
          <strong className="text-foreground tabular-nums">{resumen.deshabilitadas}</strong>
        </span>
      </div>
    </div>
  )
}
