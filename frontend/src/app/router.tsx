import { createBrowserRouter, Navigate } from 'react-router'
import { CamasPage } from '@/features/camas'
import { NotFoundPage } from './NotFoundPage'
import { RootLayout } from './RootLayout'

/**
 * Rutas de la aplicación. Para agregar una vista nueva, sumá un objeto a `children`.
 * En producción, nginx devuelve index.html para cualquier ruta (try_files),
 * así que recargar el navegador en /camas funciona.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Por ahora la única vista es Camas: la raíz redirige ahí
      { index: true, element: <Navigate to="/camas" replace /> },
      { path: 'camas', element: <CamasPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
