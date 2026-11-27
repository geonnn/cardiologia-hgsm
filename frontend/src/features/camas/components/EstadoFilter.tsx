import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { ESTADO_CONFIG, ESTADOS } from '../constants'
import type { FiltroEstado } from '../types'
import { EstadoDot } from './EstadoDot'

interface EstadoFilterProps {
  value: FiltroEstado
  onChange: (filtro: FiltroEstado) => void
  conteos: Record<FiltroEstado, number>
  /** `chips`: fila horizontal con scroll (mobile). `list`: columna (sidebar). */
  variant?: 'chips' | 'list'
  className?: string
}

const OPCIONES: ReadonlyArray<FiltroEstado> = ['todos', ...ESTADOS]

export function EstadoFilter({ value, onChange, conteos, variant = 'chips', className }: EstadoFilterProps) {
  const esLista = variant === 'list'

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      orientation={esLista ? 'vertical' : 'horizontal'}
      aria-label="Filtrar por estado"
      value={value}
      // Radix permite deseleccionar (valor vacío): en ese caso se mantiene el filtro actual
      onValueChange={(v) => v && onChange(v as FiltroEstado)}
      className={cn(
        esLista
          ? 'w-full'
          : '-mx-4 w-auto max-w-none justify-start overflow-x-auto px-4 pt-3.5 pb-1.5 [scrollbar-width:none]',
        className,
      )}
    >
      {OPCIONES.map((op) => (
        <ToggleGroupItem
          key={op}
          value={op}
          className={cn(
            'h-11 gap-2 border-[1.5px] bg-card px-3.5 font-semibold',
            'data-[state=on]:border-primary data-[state=on]:bg-card data-[state=on]:shadow-[inset_0_0_0_1px_var(--primary)]',
            esLista ? 'w-full justify-start rounded-xl' : 'rounded-full',
          )}
        >
          {op !== 'todos' && <EstadoDot estado={op} />}
          {op === 'todos' ? 'Todas' : ESTADO_CONFIG[op].label}
          <span className={cn('font-extrabold', esLista && 'ml-auto')}>{conteos[op]}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
