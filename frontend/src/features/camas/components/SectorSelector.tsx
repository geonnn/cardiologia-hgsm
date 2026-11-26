import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { SECTORES } from '../constants'
import type { Sector } from '../types'

interface SectorSelectorProps {
  value: Sector
  onChange: (sector: Sector) => void
  /** Si se pasa, muestra "N camas" junto a cada sector. */
  totalPorSector?: (sector: Sector) => number
  ariaLabel?: string
  className?: string
}

/** Selector segmentado UCO / Sala. */
export function SectorSelector({ value, onChange, totalPorSector, ariaLabel = 'Sector', className }: SectorSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      spacing={1}
      aria-label={ariaLabel}
      value={value}
      onValueChange={(v) => v && onChange(v as Sector)}
      className={cn('grid w-full max-w-[420px] auto-cols-fr grid-flow-col rounded-xl border bg-card p-1', className)}
    >
      {SECTORES.map((s) => (
        <ToggleGroupItem
          key={s}
          value={s}
          className="h-12 gap-2 rounded-lg font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {s}
          {totalPorSector && <span className="text-sm font-medium opacity-85">{totalPorSector(s)} camas</span>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
