import { cn } from '@/lib/utils'
import { ESTADO_CONFIG } from '../constants'
import type { EstadoCama } from '../types'

/** Punto de color que identifica un estado de cama. */
export function EstadoDot({ estado }: { estado: EstadoCama }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block size-3 flex-none rounded-full border border-black/35', ESTADO_CONFIG[estado].dotClass)}
    />
  )
}
