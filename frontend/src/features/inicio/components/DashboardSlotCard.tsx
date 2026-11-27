import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardSlotCardProps {
  titulo: string
  descripcion: string
  icon: LucideIcon
  etiqueta?: string
  className?: string
}

/** Bloque extensible de la plantilla de dashboard reservado para vistas futuras. */
export function DashboardSlotCard({
  titulo,
  descripcion,
  icon: Icon,
  etiqueta = 'A definir',
  className,
}: DashboardSlotCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-3 border-2 border-dashed bg-card/70 py-3.5 shadow-none',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-0">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span>{titulo}</span>
        </CardTitle>
        <Badge variant="secondary" className="text-[11px] font-semibold text-muted-foreground">
          {etiqueta}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <p className="text-sm leading-relaxed text-muted-foreground">{descripcion}</p>
      </CardContent>
    </Card>
  )
}
