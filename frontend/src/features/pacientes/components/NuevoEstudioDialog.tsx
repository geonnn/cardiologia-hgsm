import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useApiQuery } from '@/hooks/useApiQuery'
import { mensajeDeError } from '@/lib/api'
import { hoyIso } from '@/lib/fechas'
import { listarTiposEstudioRequest, type TipoEstudio } from '../api/catalogosApi'
import type { CrearEstudioPayload } from '../api/pacientesApi'
import { MAX_LONGITUD_TITULO_ESTUDIO, validarEstudio, type ErroresEstudio } from '../validaciones'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50'

interface NuevoEstudioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuardar: (payload: CrearEstudioPayload) => Promise<unknown>
}

/** Modal de carga de estudio médico complementario (RF-35). */
export function NuevoEstudioDialog({ open, onOpenChange, onGuardar }: NuevoEstudioDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Agregar estudio médico
          </DialogTitle>
          <DialogDescription>
            Registrá el tipo, fecha e informe del estudio complementario realizado al paciente.
          </DialogDescription>
        </DialogHeader>

        <NuevoEstudioForm
          onSubmit={async (payload) => {
            await onGuardar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function NuevoEstudioForm({
  onSubmit,
}: {
  onSubmit: (payload: CrearEstudioPayload) => Promise<void>
}) {
  const [hoyStr] = useState(hoyIso)
  const tiposQuery = useApiQuery<TipoEstudio[]>(listarTiposEstudioRequest())
  const tipos = tiposQuery.data ?? []

  const [tipoEstudioId, setTipoEstudioId] = useState<number | ''>('')
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState(hoyStr)
  const [descripcion, setDescripcion] = useState('')
  const [errores, setErrores] = useState<ErroresEstudio>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  // Si aún no eligió manualmente, preseleccionar el primer tipo disponible sin usar effect
  const tipoEfectivo: number | '' = tipoEstudioId !== '' ? tipoEstudioId : (tipos[0]?.id ?? '')

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarEstudio({
      tipoEstudioId: tipoEfectivo,
      titulo,
      fecha,
      descripcion,
    })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        tipoEstudioId: Number(tipoEfectivo),
        titulo: titulo.trim(),
        fecha,
        descripcion: descripcion.trim(),
      })
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="grid gap-5" aria-busy={enviando}>
      {(errorServidor || tiposQuery.error) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorServidor ?? `No se pudieron cargar los tipos de estudio: ${tiposQuery.error}`}
        </div>
      )}

      <FieldGroup className="gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={errores.tipoEstudioId ? true : undefined}>
            <FieldLabel htmlFor="estudio-tipo">
              Tipo de estudio <span className="text-destructive">*</span>
            </FieldLabel>
            <select
              id="estudio-tipo"
              className={SELECT_CLASS}
              value={tipoEfectivo}
              disabled={tiposQuery.cargando || tipos.length === 0}
              onChange={(e) => setTipoEstudioId(e.target.value ? Number(e.target.value) : '')}
            >
              {tiposQuery.cargando ? (
                <option value="">Cargando tipos…</option>
              ) : tipos.length === 0 ? (
                <option value="">No hay tipos de estudio cargados</option>
              ) : (
                tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))
              )}
            </select>
            {errores.tipoEstudioId && <FieldError>{errores.tipoEstudioId}</FieldError>}
          </Field>

          <Field data-invalid={errores.fecha ? true : undefined}>
            <FieldLabel htmlFor="estudio-fecha">
              Fecha del estudio <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="estudio-fecha"
              type="date"
              max={hoyStr}
              className="h-10"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-invalid={errores.fecha ? true : undefined}
            />
            {errores.fecha && <FieldError>{errores.fecha}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={errores.titulo ? true : undefined}>
          <FieldLabel htmlFor="estudio-titulo">
            Título del estudio <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="estudio-titulo"
            maxLength={MAX_LONGITUD_TITULO_ESTUDIO}
            placeholder="Ej. ETT de control post-infarto"
            className="h-10"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            aria-invalid={errores.titulo ? true : undefined}
          />
          {errores.titulo && <FieldError>{errores.titulo}</FieldError>}
        </Field>

        <Field data-invalid={errores.descripcion ? true : undefined}>
          <FieldLabel htmlFor="estudio-descripcion">
            Informe / Conclusión <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="estudio-descripcion"
            rows={4}
            placeholder="Detalle de hallazgos, fracción de eyección (FEVI), mediciones…"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            aria-invalid={errores.descripcion ? true : undefined}
          />
          {errores.descripcion && <FieldError>{errores.descripcion}</FieldError>}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="h-10 px-4"
          disabled={enviando || tiposQuery.cargando || tipos.length === 0}
        >
          {enviando ? 'Guardando…' : 'Guardar estudio'}
        </Button>
      </DialogFooter>
    </form>
  )
}
