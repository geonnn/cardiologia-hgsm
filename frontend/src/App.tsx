import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Componentes temporales de prueba
const CamasPage = () => (
  <div>
    <h2>Mapa de Camas (UCO y Sala)</h2>
    <p>Visualización en tiempo real de ocupación de camas.</p>
  </div>
);

const PacientesPage = () => (
  <div>
    <h2>Gestión de Pacientes</h2>
    <p>Búsqueda, registro y consulta de historias clínicas.</p>
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
          <Route index element={<Navigate to="/camas" replace />} />
          <Route path="camas" element={<CamasPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
