import { useState } from 'react'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClipboardListIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  StethoscopeIcon,
  Trash2Icon,
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
import { mensajeDeError } from '@/lib/api'
import { formatearFecha } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import type { Contacto, Estudio } from '../api/pacientesApi'
import { ConfirmarEliminacionDialog } from '../components/ConfirmarEliminacionDialog'
import { ContactoDialog } from '../components/ContactoDialog'
import { EditarPacienteDialog } from '../components/EditarPacienteDialog'
import { NuevoEstudioDialog } from '../components/NuevoEstudioDialog'
import { usePacienteDetalle } from '../hooks/usePacienteDetalle'
import { MAX_CONTACTOS } from '../validaciones'

type TabDetalle = 'datos' | 'estudios' | 'internaciones'

interface ConfirmacionPendiente {
  tipo: 'contacto' | 'estudio'
  id: string
  titulo: string
  descripcion: string
}

/** Ficha clínica del paciente: datos personales, contactos, estudios e internaciones (RF-25 / RF-35–37). */
export function DetallePacientePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    paciente,
    cargandoInicial,
    actualizando,
    noEncontrado,
    errorPaciente,
    estudios,
    cargandoEstudios,
    errorEstudios,
    recargarPaciente,
    recargarEstudios,
    guardarDatos,
    guardarContacto,
    borrarContacto,
    agregarEstudio,
    borrarEstudio,
  } = usePacienteDetalle(id)

  const [activeTab, setActiveTab] = useState<TabDetalle>('datos')

  // Estado de diálogos (el `open` va separado del ítem seleccionado para no cambiar textos al cerrar)
  const [editarAbierto, setEditarAbierto] = useState(false)
  const [estudioAbierto, setEstudioAbierto] = useState(false)
  const [contactoAbierto, setContactoAbierto] = useState(false)
  const [contactoEditando, setContactoEditando] = useState<Contacto>()
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionPendiente | null>(null)

  const abrirAltaContacto = () => {
    setContactoEditando(undefined)
    setContactoAbierto(true)
  }

  const abrirEdicionContacto = (contacto: Contacto) => {
    setContactoEditando(contacto)
    setContactoAbierto(true)
  }

  const solicitarEliminarContacto = (contacto: Contacto) => {
    const nombreCompleto = [contacto.nombre, contacto.apellido].filter(Boolean).join(' ')
    setConfirmacion({
      tipo: 'contacto',
      id: contacto.id,
      titulo: 'Eliminar contacto',
      descripcion: `¿Deseás quitar a ${nombreCompleto} de la lista de contactos del paciente?`,
    })
    setConfirmacionAbierta(true)
  }

  const solicitarEliminarEstudio = (estudio: Estudio) => {
    setConfirmacion({
      tipo: 'estudio',
      id: estudio.id,
      titulo: 'Eliminar estudio médico',
      descripcion: `¿Estás seguro de eliminar "${estudio.titulo}"? Esta acción no se puede deshacer.`,
    })
    setConfirmacionAbierta(true)
  }

  const confirmarEliminacion = async () => {
    if (!confirmacion) return
    try {
      if (confirmacion.tipo === 'contacto') {
        await borrarContacto(confirmacion.id)
        toast.success('Contacto eliminado correctamente')
      } else {
        await borrarEstudio(confirmacion.id)
        toast.success('Estudio eliminado correctamente')
      }
    } catch (err: unknown) {
      toast.error(mensajeDeError(err))
    }
  }

  if (cargandoInicial) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5" aria-hidden="true">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="size-14 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-6 w-64 animate-pulse rounded bg-muted" />
              <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="h-56 animate-pulse bg-muted/40" />
          <Card className="h-56 animate-pulse bg-muted/40" />
        </div>
      </div>
    )
  }

  if (noEncontrado || (!paciente && !errorPaciente)) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
        <Empty className="border-2 border-dashed bg-card py-12">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se encontró el paciente solicitado</EmptyTitle>
            <EmptyDescription>
              Verificá que el enlace sea correcto o volvé al padrón de pacientes.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => navigate('/pacientes')}
            >
              <ArrowLeftIcon className="size-4" />
              <span>Volver a pacientes</span>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (errorPaciente && !paciente) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
        <Empty className="border-2 border-dashed bg-card py-12">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold">No se pudo cargar la ficha del paciente</EmptyTitle>
            <EmptyDescription>{errorPaciente}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => navigate('/pacientes')}
            >
              <ArrowLeftIcon className="size-4" />
              <span>Volver a pacientes</span>
            </Button>
            <Button
              type="button"
              variant="brand"
              size="lg"
              className="h-10 px-4"
              onClick={recargarPaciente}
            >
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (!paciente) return null

  const iniciales = `${paciente.apellido[0] ?? ''}${paciente.nombre[0] ?? ''}`.toUpperCase()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/pacientes')}>
          <ArrowLeftIcon className="size-4" />
          <span>Volver a pacientes</span>
        </Button>
      </div>

      {/* Banner principal */}
      <Card
        aria-busy={actualizando}
        className={cn('gap-0 py-0 transition-opacity', actualizando && 'opacity-70')}
      >
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">
              {iniciales}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
                  {paciente.apellido}, {paciente.nombre}
                </h1>
                <Badge
                  variant="secondary"
                  className="rounded-md bg-primary/10 px-2 font-mono text-xs font-semibold text-primary"
                >
                  DNI {paciente.dni}
                </Badge>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
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
                <span>• F. Nac: {formatearFecha(paciente.fechaNacimiento)}</span>
                <span>• Registrado: {formatearFecha(paciente.fechaCarga)}</span>
                {paciente.medicoDeCabecera && (
                  <span>
                    • Médico:{' '}
                    <strong className="text-foreground">{paciente.medicoDeCabecera.nombre}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => setEditarAbierto(true)}
            >
              <PencilIcon className="size-4" />
              <span>Modificar datos</span>
            </Button>
            <Button
              type="button"
              variant="brand"
              size="lg"
              className="h-10 px-4 font-semibold"
              onClick={() => toast('Próximo módulo: Crear internación de este paciente (RF-47)')}
            >
              <PlusIcon className="size-4" strokeWidth={2.5} />
              <span>Nueva internación</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navegación por pestañas */}
      <div
        role="tablist"
        aria-label="Secciones de la ficha del paciente"
        className="flex flex-wrap gap-1 border-b border-border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'datos'}
          onClick={() => setActiveTab('datos')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'datos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <UserIcon className="size-4" />
          <span>Datos personales y contactos</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'estudios'}
          onClick={() => setActiveTab('estudios')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'estudios'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <StethoscopeIcon className="size-4" />
          <span>Estudios médicos</span>
          <Badge variant="secondary" className="h-5 px-1.5 text-xs tabular-nums">
            {estudios.length}
          </Badge>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'internaciones'}
          onClick={() => setActiveTab('internaciones')}
          className={cn(
            '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === 'internaciones'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <ClipboardListIcon className="size-4" />
          <span>Historial de internaciones</span>
        </button>
      </div>

      {/* TAB 1: Datos personales y contactos */}
      {activeTab === 'datos' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="gap-4 py-5">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-base font-bold text-primary">
                Perfil clínico y factores de riesgo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Factores de riesgo cardiovascular
                </span>
                {paciente.factoresDeRiesgo.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {paciente.factoresDeRiesgo.map((f) => (
                      <Badge
                        key={f.id}
                        variant="secondary"
                        className="border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {f.nombre}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sin factores de riesgo registrados.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Antecedentes clínicos relevantes
                </span>
                <div className="rounded-lg border bg-muted/30 p-3.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {paciente.antecedentes?.trim() || (
                    <span className="text-muted-foreground">
                      No se registraron antecedentes para este paciente.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Médico de cabecera
                </span>
                <span className="text-sm font-medium text-foreground">
                  {paciente.medicoDeCabecera?.nombre ?? (
                    <span className="font-normal text-muted-foreground">No asignado</span>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4 py-5">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-3">
              <CardTitle className="text-base font-bold text-primary">
                Contactos familiares
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {paciente.contactos.length} de {MAX_CONTACTOS}
                </span>
                {paciente.contactos.length < MAX_CONTACTOS && (
                  <Button type="button" variant="outline" size="xs" onClick={abrirAltaContacto}>
                    <PlusIcon className="size-3.5" />
                    <span>Agregar</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {paciente.contactos.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {paciente.contactos.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/25 p-3.5"
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-semibold text-foreground">
                          {c.nombre} {c.apellido ?? ''}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <PhoneIcon className="size-3.5 shrink-0" />
                          <span className="tabular-nums">{c.telefono}</span>
                          {c.parentesco && <span>• {c.parentesco}</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => abrirEdicionContacto(c)}
                          title="Modificar contacto"
                        >
                          <PencilIcon className="size-3" />
                          <span>Editar</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => solicitarEliminarContacto(c)}
                          title="Eliminar contacto"
                        >
                          <Trash2Icon className="size-3" />
                          <span>Quitar</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay contactos familiares o de emergencia registrados.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Estudios médicos (RF-35 a RF-37) */}
      {activeTab === 'estudios' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">Estudios complementarios realizados</h2>
              <p className="text-xs text-muted-foreground">
                Registro cronológico ordenado del más reciente al más antiguo
              </p>
            </div>
            <Button
              type="button"
              variant="brand"
              size="lg"
              className="h-10 px-4 font-semibold"
              onClick={() => setEstudioAbierto(true)}
            >
              <PlusIcon className="size-4" strokeWidth={2.5} />
              <span>Nuevo estudio médico</span>
            </Button>
          </div>

          {errorEstudios ? (
            <Empty className="border-2 border-dashed bg-card py-10">
              <EmptyHeader>
                <EmptyTitle className="font-extrabold">
                  No se pudieron cargar los estudios
                </EmptyTitle>
                <EmptyDescription>{errorEstudios}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-10 px-4"
                  onClick={recargarEstudios}
                >
                  Reintentar
                </Button>
              </EmptyContent>
            </Empty>
          ) : cargandoEstudios ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              <Card className="h-28 animate-pulse bg-muted/40" />
              <Card className="h-28 animate-pulse bg-muted/40" />
            </div>
          ) : estudios.length === 0 ? (
            <Empty className="border-2 border-dashed bg-card py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <StethoscopeIcon />
                </EmptyMedia>
                <EmptyTitle className="font-extrabold">Sin estudios registrados</EmptyTitle>
                <EmptyDescription>
                  El paciente aún no cuenta con estudios médicos complementarios cargados.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {estudios.map((est) => (
                <Card key={est.id} className="gap-3 py-4">
                  <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge
                        variant="secondary"
                        className="border border-primary/20 bg-primary/10 font-semibold text-primary"
                      >
                        {est.tipoEstudio.nombre}
                      </Badge>
                      <CardTitle className="text-base font-bold text-foreground">
                        {est.titulo}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground tabular-nums">
                        <CalendarIcon className="size-3.5" />
                        <span>{formatearFecha(est.fecha)}</span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => solicitarEliminarEstudio(est)}
                        title="Eliminar estudio médico"
                      >
                        <Trash2Icon className="size-3.5" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                      {est.descripcion}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Historial de internaciones (RF-48) */}
      {activeTab === 'internaciones' && (
        <Card className="gap-4 py-5">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base font-bold text-primary">
              Historial de internaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Empty className="border-2 border-dashed py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ClipboardListIcon />
                </EmptyMedia>
                <EmptyTitle className="font-extrabold">Sin internaciones registradas</EmptyTitle>
                <EmptyDescription>
                  Este paciente no registra internaciones finalizadas ni una internación en curso
                  actualmente. Podrás registrar una con el botón superior{' '}
                  <strong>&ldquo;Nueva internación&rdquo;</strong>.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}

      {/* Diálogos */}
      <EditarPacienteDialog
        open={editarAbierto}
        paciente={paciente}
        onOpenChange={setEditarAbierto}
        onGuardar={async (datos) => {
          await guardarDatos(datos)
          toast.success('Datos del paciente actualizados')
        }}
      />

      <ContactoDialog
        open={contactoAbierto}
        contacto={contactoEditando}
        onOpenChange={setContactoAbierto}
        onGuardar={async (contactoId, datos) => {
          await guardarContacto(contactoId, datos)
          toast.success(
            contactoId ? 'Contacto modificado correctamente' : 'Contacto agregado correctamente',
          )
        }}
      />

      <NuevoEstudioDialog
        open={estudioAbierto}
        onOpenChange={setEstudioAbierto}
        onGuardar={async (payload) => {
          await agregarEstudio(payload)
          toast.success('Estudio registrado correctamente')
        }}
      />

      <ConfirmarEliminacionDialog
        open={confirmacionAbierta}
        titulo={confirmacion?.titulo ?? ''}
        descripcion={confirmacion?.descripcion ?? ''}
        onOpenChange={setConfirmacionAbierta}
        onConfirmar={confirmarEliminacion}
      />
    </div>
  )
}
