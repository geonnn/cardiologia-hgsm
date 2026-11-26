import { formatearFecha } from '@/lib/fechas'
import { cn } from '@/lib/utils'
import type { PacienteInternado } from '../types'
import { abreviarSexo, textoDiasInternacion } from '../utils'

interface PacienteResumenProps {
  paciente: PacienteInternado
  /** Clases de color para la etiqueta de aislamiento (por defecto, colores invertidos de la tarjeta). */
  aislamientoClass?: string
}

export function PacienteResumen({ paciente, aislamientoClass }: PacienteResumenProps) {
  const { nombre, edad, sexo, fechaIngreso, motivoInternacion, aislamiento } = paciente
  return (
    <div className="mt-auto grid gap-0.5 text-[15px]">
      <b className="text-lg leading-tight font-semibold">
        {nombre} · {edad} · {abreviarSexo(sexo)}
      </b>
      <span>
        Ingreso {formatearFecha(fechaIngreso)} · {textoDiasInternacion(fechaIngreso)}
      </span>
      <span className="line-clamp-2 font-semibold" title={motivoInternacion}>
        {motivoInternacion}
      </span>
      {aislamiento && (
        <span
          className={cn(
            'mt-1 justify-self-start rounded-full bg-foreground px-2.5 py-0.5 text-[13px] font-semibold text-background',
            aislamientoClass,
          )}
        >
          Aislamiento: {aislamiento}
        </span>
      )}
    </div>
  )
}
