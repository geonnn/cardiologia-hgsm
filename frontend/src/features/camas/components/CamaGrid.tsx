import type { ReactNode } from 'react'
import type { AccionCama, Cama } from '../types'
import { CamaCard } from './CamaCard'

interface CamaGridProps {
  camas: ReadonlyArray<Cama>
  onAbrirFicha: (cama: Cama) => void
  onIniciarInternacion: (cama: Cama) => void
  onAccion: (cama: Cama, accion: AccionCama) => void
  /** Se muestra cuando no hay camas. */
  empty?: ReactNode
}

export function CamaGrid({ camas, onAbrirFicha, onIniciarInternacion, onAccion, empty }: CamaGridProps) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:gap-4">
      {camas.length
        ? camas.map((cama) => (
            <CamaCard
              key={cama.id}
              cama={cama}
              onAbrirFicha={onAbrirFicha}
              onIniciarInternacion={onIniciarInternacion}
              onAccion={onAccion}
            />
          ))
        : empty}
    </div>
  )
}
