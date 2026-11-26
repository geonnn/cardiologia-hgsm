import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { ObraSocial } from '../api/obrasSocialesApi'
import { ObraSocialAccionesMenu } from './ObraSocialAccionesMenu'

interface ObrasSocialesListProps {
  /** Ya ordenadas alfabéticamente por la API (RF-21). */
  obrasSociales: ReadonlyArray<ObraSocial>
  /** Texto buscado, para resaltar la coincidencia en cada nombre. */
  resaltar?: string
  onModificar: (obraSocial: ObraSocial) => void
  onEliminar: (obraSocial: ObraSocial) => void
  /** Qué mostrar si la lista está vacía. */
  empty?: ReactNode
}

export function ObrasSocialesList({ obrasSociales, resaltar, onModificar, onEliminar, empty }: ObrasSocialesListProps) {
  if (obrasSociales.length === 0) return <>{empty}</>

  return (
    <Card className="mt-3 gap-0 py-0">
      <ul className="divide-y" aria-label="Obras sociales">
        {obrasSociales.map((obraSocial) => (
          <li key={obraSocial.id} className="flex min-h-16 items-center gap-3 py-2 pr-2 pl-5">
            <span className="min-w-0 flex-1 truncate text-base font-semibold">
              <TextoResaltado texto={obraSocial.nombre} resaltar={resaltar} />
            </span>
            <ObraSocialAccionesMenu obraSocial={obraSocial} onModificar={onModificar} onEliminar={onEliminar} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

/** Marca la primera aparición de `resaltar` dentro de `texto` (sin distinguir mayúsculas). */
function TextoResaltado({ texto, resaltar }: { texto: string; resaltar?: string }) {
  const indice = resaltar ? texto.toLowerCase().indexOf(resaltar.toLowerCase()) : -1
  if (!resaltar || indice < 0) return texto

  const fin = indice + resaltar.length
  return (
    <>
      {texto.slice(0, indice)}
      <mark className="rounded-sm bg-estado-aislamiento px-0.5 text-inherit">{texto.slice(indice, fin)}</mark>
      {texto.slice(fin)}
    </>
  )
}

/** Filas de relleno mientras se cargan las obras sociales por primera vez. */
export function ObrasSocialesListSkeleton({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <Card className="mt-3 gap-0 py-0" aria-hidden="true">
      <div className="divide-y">
        {Array.from({ length: cantidad }, (_, i) => (
          <div key={i} className="flex min-h-16 items-center px-5">
            <div className="h-4 animate-pulse rounded bg-muted" style={{ width: `${35 + ((i * 17) % 40)}%` }} />
          </div>
        ))}
      </div>
    </Card>
  )
}
