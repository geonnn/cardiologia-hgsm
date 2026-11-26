import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PacientesPage from './pages/Pacientes/PacientesPage';
import NuevoPacientePage from './pages/Pacientes/NuevoPacientePage';
import DetallePacientePage from './pages/Pacientes/DetallePacientePage';

// Componentes temporales para las otras secciones
const CamasPage = () => (
  <div>
    <h2>Mapa de Camas (UCO y Sala)</h2>
    <p>Visualización en tiempo real de ocupación de camas.</p>
  </div>
);

const UsuariosPage = () => (
  <div>
    <h2>Administración de Usuarios</h2>
    <p>Gestión de altas, bajas y permisos del personal.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/pacientes" replace />} />
          <Route path="camas" element={<CamasPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="pacientes/nuevo" element={<NuevoPacientePage />} />
          <Route path="pacientes/:id" element={<DetallePacientePage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
