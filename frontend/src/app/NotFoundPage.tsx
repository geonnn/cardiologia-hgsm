import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

/** Página para cualquier URL que no coincide con una ruta. */
export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <Empty className="border-2 border-dashed bg-card">
        <EmptyHeader>
          <EmptyTitle className="text-xl font-extrabold">Página no encontrada</EmptyTitle>
          <EmptyDescription>La dirección que ingresaste no existe.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" size="lg" className="h-11 px-4">
            <Link to="/">Ir al inicio</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
