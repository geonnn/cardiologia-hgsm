import { Card, CardContent } from '@/components/ui/card'
import type { Sector } from '../types'

interface OcupacionResumenProps {
  sector: Sector
  ocupadas: number
  total: number
}

export function OcupacionResumen({ sector, ocupadas, total }: OcupacionResumenProps) {
  return (
    <Card size="sm" className="text-[15px] ring-border">
      <CardContent>
        <b>Ocupación {sector}</b>
        <br />
        {ocupadas} de {total} camas ocupadas
      </CardContent>
    </Card>
  )
}
