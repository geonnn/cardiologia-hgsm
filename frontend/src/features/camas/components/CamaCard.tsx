import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ESTADO_CONFIG } from '../constants'
import type { AccionCama, Cama } from '../types'
import { CamaAccionesMenu } from './CamaAccionesMenu'
import { EstadoBadge } from './EstadoBadge'
import { PacienteResumen } from './PacienteResumen'

interface CamaCardProps {
  cama: Cama
  /** Clic en una tarjeta con paciente. */
  onAbrirFicha: (cama: Cama) => void
  onAccion: (cama: Cama, accion: AccionCama) => void
}

/**
 * Tarjeta de una cama. Clic en la tarjeta: abre la ficha si hay paciente;
 * si no, despliega el menú de acciones.
 */
export function CamaCard({ cama, onAbrirFicha, onAccion }: CamaCardProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { numero, sector, estado, paciente } = cama
  const config = ESTADO_CONFIG[estado]

  return (
    <Card
      className={cn('relative min-h-42 gap-2 rounded-2xl px-3.5 pt-3.5 pb-4 ring-black/10', config.cardClass)}
      aria-label={`Cama ${numero} de ${sector}`}
      role="article"
    >
      <div className="flex items-start gap-2">
        <div className="text-[44px] leading-none font-extrabold tracking-tighter">
          <small className="mb-0.5 block text-[13px] font-semibold tracking-normal">{sector}</small>
          {numero}
        </div>
        <EstadoBadge estado={estado} className="ml-auto" />
        <CamaAccionesMenu
          cama={cama}
          open={menuAbierto}
          onOpenChange={setMenuAbierto}
          onAccion={onAccion}
          triggerClassName="relative z-10 -mt-1.5 -mr-2"
        />
      </div>

      {paciente ? (
        <PacienteResumen paciente={paciente} />
      ) : (
        <p className="mt-auto text-[15px]">{config.nota}</p>
      )}

      {/* Botón invisible que cubre toda la tarjeta */}
      <button
        type="button"
        className="absolute inset-0 rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={paciente ? `Abrir ficha de ${paciente.nombreCompleto}` : `Ver acciones de la cama ${numero}`}
        onClick={() => (paciente ? onAbrirFicha(cama) : setMenuAbierto(true))}
      />
    </Card>
  )
}
