import { Link } from 'react-router'
import { AppHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

/** Página para cualquier URL que no coincide con una ruta. */
export function NotFoundPage() {
  return (
    <>
      <AppHeader />
      <main className="p-4 md:p-7">
        <Empty className="border-2 border-dashed">
          <EmptyHeader>
            <EmptyTitle className="text-xl font-extrabold">Página no encontrada</EmptyTitle>
            <EmptyDescription>La dirección que ingresaste no existe.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline" size="lg" className="h-11 px-4">
              <Link to="/camas">Ir a Camas</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    </>
  )
}
