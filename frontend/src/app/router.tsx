import { createBrowserRouter, Navigate } from 'react-router'
import { CamasPage } from '@/features/camas'
import { ObrasSocialesPage } from '@/features/obras-sociales'
import { MainLayout } from '@/layouts/MainLayout'
import { DetallePacientePage } from '@/pages/Pacientes/DetallePacientePage'
import { NuevoPacientePage } from '@/pages/Pacientes/NuevoPacientePage'
import { PacientesPage } from '@/pages/Pacientes/PacientesPage'

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
      { path: 'obras-sociales', element: <ObrasSocialesPage /> },
      {
        // Las vistas de pacientes usan el layout con el panel lateral (Sidebar)
        path: 'pacientes',
        element: <MainLayout />,
        children: [
          { index: true, element: <PacientesPage /> },
          { path: 'nuevo', element: <NuevoPacientePage /> },
          { path: ':id', element: <DetallePacientePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
