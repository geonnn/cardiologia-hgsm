import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ESTADO_CONFIG } from '../constants'
import type { EstadoCama } from '../types'

export function EstadoBadge({ estado, className }: { estado: EstadoCama; className?: string }) {
  const { icon: Icon, label } = ESTADO_CONFIG[estado]
  return (
    <Badge className={cn('h-auto gap-1.5 bg-white/55 px-2.5 py-1 text-sm font-semibold text-inherit', className)}>
      <Icon data-icon="inline-start" strokeWidth={2.2} />
      {label}
    </Badge>
  )
}
