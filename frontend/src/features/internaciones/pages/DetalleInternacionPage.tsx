import { useState } from 'react'
import {
  ArrowLeftIcon,
  BedDoubleIcon,
  Building2Icon,
  CalendarIcon,
  CheckSquareIcon,
  ClipboardListIcon,
  FileTextIcon,
  LogOutIcon,
  PencilIcon,
  PillIcon,
  ShieldAlertIcon,
  UserIcon,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { formatearFechaHora, hoyIso } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import { EditarInternacionDialog } from '../components/EditarInternacionDialog'
import { RegistrarAltaDialog } from '../components/RegistrarAltaDialog'
import { CONDICION_ALTA_POR_VALOR } from '../constants'
import { useInternacionDetalle } from '../hooks/useInternacionDetalle'

type TabInternacion = 'resumen' | 'evoluciones' | 'tratamientos' | 'pendientes'

const MS_POR_DIA = 86_400_000

const calcularDiasEntre = (inicioIso: string, finIsoOHoy: string) => {
  const inicio = new Date(inicioIso)
  inicio.setHours(0, 0, 0, 0)
  const fin = finIsoOHoy.includes('T')
    ? new Date(finIsoOHoy)
    : new Date(`${finIsoOHoy}T00:00:00`)
  fin.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((fin.getTime() - inicio.getTime()) / MS_POR_DIA))
}

/** Vista operativa de una internación (activa o histórica): resumen, modificación/swap (RF-49) y alta (RF-50). */
export function DetalleInternacionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [hoyStr] = useState(hoyIso)

  const {
    internacion,
    cargandoInicial,
    actualizando,
    noEncontrado,
    error,
    recargar,
    modificar,
    darAlta,
  } = useInternacionDetalle(id)

  const [activeTab, setActiveTab] = useState<TabInternacion>('resumen')
  const [editarAbierto, setEditarAbierto] = useState(false)
  const [altaAbierta, setAltaAbierta] = useState(false)

  if (cargandoInicial) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4" aria-hidden="true">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
        <Card className="p-5">
          <div className="flex flex-col gap-3">
            <div className="h-6 w-72 animate-pulse rounded bg-muted" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="h-56 animate-pulse bg-muted/40 lg:col-span-7" />
          <Card className="h-56 animate-pulse bg-muted/40 lg:col-span-5" />
        </div>
      </div>
    )
  }

  if (noEncontrado || (!internacion && !error)) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
        <Empty className="border-2 border-dashed bg-card py-12">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">
              No se encontró la internación solicitada
            </EmptyTitle>
            <EmptyDescription>
              Verificá el enlace o volvé al mapa de camas.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => navigate('/camas')}
            >
              <ArrowLeftIcon className="size-4" />
              <span>Volver a camas</span>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (error && !internacion) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
        <Empty className="border-2 border-dashed bg-card py-12">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se pudo cargar la internación</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => navigate('/camas')}
            >
              <ArrowLeftIcon className="size-4" />
              <span>Volver a camas</span>
            </Button>
            <Button
              type="button"
              variant="brand"
              size="lg"
              className="h-10 px-4"
              onClick={recargar}
            >
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (!internacion) return null

  const { paciente, cama } = internacion
  const condicionAlta = internacion.condicionAlta
    ? CONDICION_ALTA_POR_VALOR[internacion.condicionAlta]
    : null
  const diasEstadia = calcularDiasEntre(
    internacion.fechaInternacion,
    internacion.fechaFin ?? hoyStr,
  )
  const camaDescripcion = `${cama.sector} #${cama.numeroCama}`
  const pacienteNombre = `${paciente.apellido}, ${paciente.nombre}`

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      {/* Navegación superior */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/camas')}>
          <ArrowLeftIcon className="size-4" />
          <span>Volver a camas</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/pacientes/${paciente.id}`)}
        >
          <UserIcon className="size-4" />
          <span>Ver ficha del paciente</span>
        </Button>
      </div>

      {/* Banner principal de la internación */}
      <Card
        aria-busy={actualizando}
        className={cn('gap-0 py-0 transition-opacity', actualizando && 'opacity-70')}
      >
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {internacion.estaActiva ? (
                <Badge className="bg-emerald-600 font-semibold text-white">
                  Internación activa
                </Badge>
              ) : (
                condicionAlta && (
                  <Badge variant="secondary" className={cn('font-semibold', condicionAlta.badgeClass)}>
                    Finalizada — {condicionAlta.label}
                  </Badge>
                )
              )}

              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1 bg-primary/10 font-semibold text-primary"
              >
                <BedDoubleIcon className="size-3.5" />
                <span>{camaDescripcion}</span>
              </Badge>

              <Badge variant="outline" className="font-semibold">
                Manejo {internacion.manejo}
              </Badge>

              {internacion.aislamiento && (
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-1 bg-amber-100 font-semibold text-amber-900"
                >
                  <ShieldAlertIcon className="size-3.5" />
                  <span>Aislamiento: {internacion.aislamiento}</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
                {pacienteNombre}
              </h1>
              <Badge
                variant="secondary"
                className="rounded-md bg-primary/10 px-2 font-mono text-xs font-semibold text-primary"
              >
                DNI {paciente.dni}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className={cn(
                  'font-semibold',
                  paciente.sexo === 'Femenino'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-sky-100 text-sky-800',
                )}
              >
                {paciente.sexo}
              </Badge>
              <span>
                <strong className="text-foreground">{paciente.edad}</strong> años
              </span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <CalendarIcon className="size-3.5" />
                <span>
                  Ingreso:{' '}
                  <strong className="text-foreground">
                    {formatearFechaHora(internacion.fechaInternacion)}
                  </strong>
                </span>
              </span>
              <span className="tabular-nums">
                •{' '}
                <strong className="text-foreground">
                  {diasEstadia === 0 ? 'Ingresó hoy' : `${diasEstadia} ${diasEstadia === 1 ? 'día' : 'días'}`}
                </strong>
              </span>
              {internacion.fechaFin && (
                <span className="tabular-nums">
                  • Egreso:{' '}
                  <strong className="text-foreground">
                    {formatearFechaHora(internacion.fechaFin)}
                  </strong>
                </span>
              )}
              {internacion.obraSocial && (
                <span className="inline-flex items-center gap-1">
                  • <Building2Icon className="size-3.5" />
                  <span>{internacion.obraSocial.nombre}</span>
                </span>
              )}
            </div>
          </div>

          {internacion.estaActiva && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-10 px-4"
                onClick={() => setEditarAbierto(true)}
              >
                <PencilIcon className="size-4" />
                <span>Modificar / Cambiar cama</span>
              </Button>
              <Button
                type="button"
                variant="brand"
                size="lg"
                className="h-10 px-4 font-semibold"
                onClick={() => setAltaAbierta(true)}
              >
                <LogOutIcon className="size-4" />
                <span>Registrar alta</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pestañas de la internación */}
      <div
        role="tablist"
        aria-label="Secciones de la internación"
        className="flex flex-wrap gap-1 border-b border-border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'resumen'}
          onClick={() => setActiveTab('resumen')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'resumen'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <ClipboardListIcon className="size-4" />
          <span>Resumen clínico</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'evoluciones'}
          onClick={() => setActiveTab('evoluciones')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'evoluciones'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <FileTextIcon className="size-4" />
          <span>Evoluciones</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tratamientos'}
          onClick={() => setActiveTab('tratamientos')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'tratamientos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <PillIcon className="size-4" />
          <span>Tratamientos</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pendientes'}
          onClick={() => setActiveTab('pendientes')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'pendientes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <CheckSquareIcon className="size-4" />
          <span>Pendientes</span>
        </button>
      </div>

      {/* TAB 1: Resumen clínico */}
      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="gap-3.5 py-4 lg:col-span-7">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-base font-bold text-primary">
                Motivos y cuadro de ingreso
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Motivos de internación
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {internacion.motivosInternacion.map((m) => (
                    <Badge
                      key={m.id}
                      variant="secondary"
                      className="border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      {m.nombre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Enfermedad actual
                </span>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                  {internacion.enfermedadActual}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Obra social
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {internacion.obraSocial?.nombre ?? (
                      <span className="font-normal text-muted-foreground">No informada</span>
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Aislamiento
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {internacion.aislamiento ?? (
                      <span className="font-normal text-muted-foreground">Sin aislamiento</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-3.5 py-4 lg:col-span-5">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-base font-bold text-primary">
                Información clínica complementaria
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Parámetros / Antropometría
                </span>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                  {internacion.parametrosAntropometria?.trim() || (
                    <span className="text-muted-foreground">Sin registros de antropometría.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Tratamiento previo
                </span>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                  {internacion.tratamientoPrevio?.trim() || (
                    <span className="text-muted-foreground">No se registró tratamiento previo.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Observaciones
                </span>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                  {internacion.observaciones?.trim() || (
                    <span className="text-muted-foreground">Sin observaciones registradas.</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TABS preparados para próximos módulos */}
      {activeTab === 'evoluciones' && (
        <Card className="py-6">
          <CardContent>
            <Empty className="border-2 border-dashed py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileTextIcon />
                </EmptyMedia>
                <EmptyTitle className="font-extrabold">Evoluciones clínicas</EmptyTitle>
                <EmptyDescription>
                  Próximo módulo: registro cronológico y búsqueda de evoluciones médicas de esta
                  internación (RF-38 / RF-39).
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tratamientos' && (
        <Card className="py-6">
          <CardContent>
            <Empty className="border-2 border-dashed py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PillIcon />
                </EmptyMedia>
                <EmptyTitle className="font-extrabold">Tratamientos e indicaciones</EmptyTitle>
                <EmptyDescription>
                  Próximo módulo: historial, alta, modificación del último esquema y baja de
                  tratamientos de esta internación (RF-40 a RF-43).
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pendientes' && (
        <Card className="py-6">
          <CardContent>
            <Empty className="border-2 border-dashed py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckSquareIcon />
                </EmptyMedia>
                <EmptyTitle className="font-extrabold">Pendientes asistenciales</EmptyTitle>
                <EmptyDescription>
                  Próximo módulo: lista de tareas pendientes y registro de realización de esta
                  internación (RF-44 a RF-46).
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {/* Diálogos */}
      <EditarInternacionDialog
        open={editarAbierto}
        internacion={internacion}
        onOpenChange={setEditarAbierto}
        onGuardar={async (payload) => {
          await modificar(payload)
          toast.success('Internación actualizada correctamente')
        }}
      />

      <RegistrarAltaDialog
        open={altaAbierta}
        pacienteNombre={pacienteNombre}
        camaDescripcion={camaDescripcion}
        fechaIngresoIso={internacion.fechaInternacion}
        onOpenChange={setAltaAbierta}
        onConfirmar={async (payload) => {
          await darAlta(payload)
          toast.success(`Egreso registrado. La cama ${camaDescripcion} quedó disponible`)
        }}
      />
    </div>
  )
}
