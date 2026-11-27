import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout'
import { CamasPage } from '@/features/camas'
import {
  FactoresDeRiesgoPage,
  MotivosInternacionPage,
  ObrasSocialesPage,
  TiposEstudioPage,
} from '@/features/catalogos'
import { InicioPage } from '@/features/inicio'
import { DetalleInternacionPage, NuevaInternacionPage } from '@/features/internaciones'
import { DetallePacientePage, NuevoPacientePage, PacientesPage } from '@/features/pacientes'

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
      {
        element: <AppShell />,
        children: [
          { index: true, element: <InicioPage /> },
          { path: 'camas', element: <CamasPage /> },
          { path: 'obras-sociales', element: <ObrasSocialesPage /> },
          { path: 'tipos-estudio', element: <TiposEstudioPage /> },
          { path: 'motivos-internacion', element: <MotivosInternacionPage /> },
          { path: 'factores-de-riesgo', element: <FactoresDeRiesgoPage /> },
          {
            path: 'pacientes',
            children: [
              { index: true, element: <PacientesPage /> },
              { path: 'nuevo', element: <NuevoPacientePage /> },
              { path: ':id', element: <DetallePacientePage /> },
            ],
          },
          {
            path: 'internaciones',
            children: [
              { path: 'nueva', element: <NuevaInternacionPage /> },
              { path: ':id', element: <DetalleInternacionPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
