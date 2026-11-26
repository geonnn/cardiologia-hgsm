import { Outlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'

/** Layout común a todas las rutas: renderiza la página actual y los avisos (toasts). */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="bottom-center" offset={92} />
    </>
  )
}
