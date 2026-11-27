import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ESTADO_CONFIG } from '../constants'
import type { AccionCama, Cama } from '../types'
import { CamaAccionesMenu } from './CamaAccionesMenu'
import { EstadoBadge } from './EstadoBadge'
import { PacienteResumen } from './PacienteResumen'

/** Achica el número de cama cuando tiene muchos dígitos, para que entre junto a la etiqueta de estado. */
const tamanioNumero = (numero: number) => {
  const digitos = String(numero).length
  if (digitos <= 3) return 'text-[44px]'
  if (digitos <= 5) return 'text-[34px]'
  return 'text-[26px]'
}

interface CamaCardProps {
  cama: Cama
  /** Clic en una tarjeta con paciente. */
  onAbrirFicha: (cama: Cama) => void
  /** Clic en una tarjeta disponible para iniciar internación directa. */
  onIniciarInternacion: (cama: Cama) => void
  onAccion: (cama: Cama, accion: AccionCama) => void
}

/**
 * Tarjeta de una cama.
 * - Ocupada: clic abre la ficha de internación.
 * - Disponible: clic abre directamente el formulario de nueva internación con la cama seleccionada.
 * - Aislamiento / Deshabilitada: clic despliega el menú de acciones.
 */
export function CamaCard({ cama, onAbrirFicha, onIniciarInternacion, onAccion }: CamaCardProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { numero, sector, estado, paciente } = cama
  const config = ESTADO_CONFIG[estado]
  const esDisponible = estado === 'disponible'

  return (
    <Card
      className={cn('relative min-h-42 gap-2 rounded-2xl px-3.5 pt-3.5 pb-4 ring-black/10', config.cardClass)}
      aria-label={`Cama ${numero} de ${sector}`}
      role="article"
    >
      {/* El menú va fijo arriba a la derecha (pr-10 le deja lugar). Si el número y la etiqueta de estado
          no entran en una línea, la etiqueta pasa abajo en vez de empujar y recortar el número. */}
      <div className="flex flex-wrap items-start gap-x-2 gap-y-1.5 pr-10">
        <div className={cn('min-w-0 leading-none font-extrabold tracking-tighter', tamanioNumero(numero))}>
          <small className="mb-0.5 block text-[13px] font-semibold tracking-normal">{sector}</small>
          <span className="break-all">{numero}</span>
        </div>
        <EstadoBadge estado={estado} className="ml-auto" />
      </div>
      <CamaAccionesMenu
        cama={cama}
        open={menuAbierto}
        onOpenChange={setMenuAbierto}
        onAccion={onAccion}
        triggerClassName="absolute top-2 right-1.5 z-10"
      />

      {paciente ? (
        <PacienteResumen paciente={paciente} />
      ) : (
        <p className="mt-auto text-[15px]">{config.nota}</p>
      )}

      {/* Botón invisible que cubre toda la tarjeta */}
      <button
        type="button"
        className="absolute inset-0 rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={
          paciente
            ? `Abrir ficha de ${paciente.nombreCompleto}`
            : esDisponible
              ? `Iniciar internación en la cama ${numero} de ${sector}`
              : `Ver acciones de la cama ${numero}`
        }
        onClick={() => {
          if (paciente) onAbrirFicha(cama)
          else if (esDisponible) onIniciarInternacion(cama)
          else setMenuAbierto(true)
        }}
      />
    </Card>
  )
}
