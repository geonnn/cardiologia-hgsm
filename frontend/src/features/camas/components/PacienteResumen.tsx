import { formatearFecha, haceDias } from '@/lib/fechas'
import type { PacienteInternado } from '../types'
import { abreviarSexo, textoDiasInternacion } from '../utils'

export function PacienteResumen({ paciente }: { paciente: PacienteInternado }) {
  const { nombreCompleto, edad, sexo, diasInternado, motivosInternacion } = paciente
  const motivos = motivosInternacion.join(', ')

  return (
    <div className="mt-auto grid gap-0.5 text-[15px]">
      <b className="text-lg leading-tight font-semibold">
        {nombreCompleto} · {edad} · {abreviarSexo(sexo)}
      </b>
      <span>
        Ingreso {formatearFecha(haceDias(diasInternado))} · {textoDiasInternacion(diasInternado)}
      </span>
      {motivos && (
        <span className="line-clamp-2 font-semibold" title={motivos}>
          {motivos}
        </span>
      )}
    </div>
  )
}
