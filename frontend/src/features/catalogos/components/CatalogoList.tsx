import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { ItemCatalogo } from '../types'
import { CatalogoAccionesMenu } from './CatalogoAccionesMenu'

interface CatalogoListProps {
  /** Ya ordenados alfabéticamente por la API. */
  items: ReadonlyArray<ItemCatalogo>
  /** Nombre accesible de la lista, ej. "Obras sociales". */
  label: string
  /** Texto buscado, para resaltar la coincidencia en cada nombre. */
  resaltar?: string
  onModificar: (item: ItemCatalogo) => void
  onEliminar: (item: ItemCatalogo) => void
  /** Qué mostrar si la lista está vacía. */
  empty?: ReactNode
}

export function CatalogoList({ items, label, resaltar, onModificar, onEliminar, empty }: CatalogoListProps) {
  if (items.length === 0) return <>{empty}</>

  return (
    <Card className="mt-3 gap-0 py-0">
      <ul className="divide-y" aria-label={label}>
        {items.map((item) => (
          <li key={item.id} className="flex min-h-16 items-center gap-3 py-2 pr-2 pl-5">
            {/* Los nombres pueden ser largos (hasta 100 caracteres): se parten en varias líneas */}
            <span className="min-w-0 flex-1 text-base font-semibold break-words">
              <TextoResaltado texto={item.nombre} resaltar={resaltar} />
            </span>
            <CatalogoAccionesMenu item={item} onModificar={onModificar} onEliminar={onEliminar} />
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

/** Filas de relleno mientras se carga el catálogo por primera vez. */
export function CatalogoListSkeleton({ cantidad = 6 }: { cantidad?: number }) {
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
