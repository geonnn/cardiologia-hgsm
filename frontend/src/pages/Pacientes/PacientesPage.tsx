import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarPacientes } from '../../services/pacienteService';
import { listarFactoresDeRiesgo, listarMotivosInternacion } from '../../services/catalogoService';
import SearchSelect from '../../components/SearchSelect/SearchSelect';
import type { PacienteResumen, Sexo, FactorDeRiesgo, MotivoInternacion } from '../../types/paciente';
import styles from './PacientesPage.module.css';

// Pacientes de demostración con fecha de registro
const PACIENTES_DEMO: PacienteResumen[] = [
  {
    id: '1',
    nombre: 'Carlos Alberto',
    apellido: 'Gómez',
    dni: '28456123',
    edad: 45,
    sexo: 'Masculino',
    fechaCarga: '2026-11-15T09:30:00Z',
  },
  {
    id: '2',
    nombre: 'María Elena',
    apellido: 'Rodríguez',
    dni: '32987654',
    edad: 39,
    sexo: 'Femenino',
    fechaCarga: '2026-11-18T14:15:00Z',
  },
  {
    id: '3',
    nombre: 'Juan Manuel',
    apellido: 'Fernández',
    dni: '18234567',
    edad: 61,
    sexo: 'Masculino',
    fechaCarga: '2026-11-20T11:00:00Z',
  },
  {
    id: '4',
    nombre: 'Lucía Beatriz',
    apellido: 'Sánchez',
    dni: '41122334',
    edad: 28,
    sexo: 'Femenino',
    fechaCarga: '2026-11-22T16:45:00Z',
  },
];

/** Formatea fechas ISO a formato argentino DD/MM/AAAA */
function formatearFecha(fechaStr?: string): string {
  if (!fechaStr) return '-';
  const partes = fechaStr.split('T')[0].split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaStr;
}

export const PacientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteResumen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Catálogos para filtros
  const [motivosDisponibles, setMotivosDisponibles] = useState<MotivoInternacion[]>([]);
  const [factoresDisponibles, setFactoresDisponibles] = useState<FactorDeRiesgo[]>([]);

  // Estados de los filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [motivoId, setMotivoId] = useState<number | undefined>(undefined);
  const [factorId, setFactorId] = useState<number | undefined>(undefined);
  const [sexoFiltro, setSexoFiltro] = useState<Sexo | ''>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  // Cargar catálogos iniciales para los filtros
  useEffect(() => {
    listarMotivosInternacion().then(setMotivosDisponibles);
    listarFactoresDeRiesgo().then(setFactoresDisponibles);
  }, []);

  const cargarPacientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarPacientes({
        page,
        pageSize,
        busqueda: busqueda.trim() || undefined,
        sexo: sexoFiltro || undefined,
        factorDeRiesgoId: factorId,
        motivoInternacionId: motivoId,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
      });

      setPacientes(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages || 1);
    } catch {
      // Modo demostración si el backend local no está corriendo
      let filtrados = PACIENTES_DEMO;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        filtrados = filtrados.filter(
          (p) =>
            p.dni.toLowerCase().includes(q) ||
            p.apellido.toLowerCase().includes(q) ||
            p.nombre.toLowerCase().includes(q)
        );
      }
      if (sexoFiltro) {
        filtrados = filtrados.filter((p) => p.sexo === sexoFiltro);
      }
      setPacientes(filtrados);
      setTotalCount(filtrados.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, busqueda, sexoFiltro, factorId, motivoId, fechaDesde, fechaHasta]);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarPacientes();
    }, 250);
    return () => clearTimeout(timer);
  }, [cargarPacientes]);

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setMotivoId(undefined);
    setFactorId(undefined);
    setSexoFiltro('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  const handleVerFicha = (paciente: PacienteResumen) => {
    navigate(`/pacientes/${paciente.id}`);
  };

  return (
    <div className={styles.container}>
      {/* Encabezado superior */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>Gestión de Pacientes</h1>
        </div>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => navigate('/pacientes/nuevo')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button
            type="button"
            className={styles.btnRetry}
            onClick={() => cargarPacientes()}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Layout de dos columnas: Filtros a la izquierda | Tabla a la derecha */}
      <div className={styles.layout}>
        {/* Columna Izquierda: Panel de Filtros */}
        <aside className={styles.filterPanel}>
          <div className={styles.filterHeader}>
            <h2 className={styles.filterTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filtros</span>
            </h2>
            <button
              type="button"
              className={styles.btnClearAll}
              onClick={handleLimpiarFiltros}
              title="Restablecer todos los filtros"
            >
              Limpiar
            </button>
          </div>

          {/* 1. Búsqueda por texto (DNI, Nombre o Apellido) */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Buscar Paciente</label>
            <input
              type="text"
              className={styles.input}
              placeholder="DNI, Apellido o Nombre"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 2. Filtro con búsqueda por Motivo de Internación */}
          <SearchSelect
            label="Motivo de Internación"
            placeholder="Motivo"
            options={motivosDisponibles}
            value={motivoId}
            onChange={(val) => {
              setMotivoId(val);
              setPage(1);
            }}
          />

          {/* 3. Filtro con búsqueda por Factores de Riesgo */}
          <SearchSelect
            label="Factor de Riesgo"
            placeholder="Factor"
            options={factoresDisponibles}
            value={factorId}
            onChange={(val) => {
              setFactorId(val);
              setPage(1);
            }}
          />

          {/* 4. Filtro por Sexo */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sexo</label>
            <select
              className={styles.select}
              value={sexoFiltro}
              onChange={(e) => {
                setSexoFiltro(e.target.value as Sexo | '');
                setPage(1);
              }}
            >
              <option value="">Todos</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
            </select>
          </div>

          {/* 5. Filtro por Fecha de Carga (Intervalo Desde / Hasta) */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Fecha de Carga (Registro)</label>
            <div className={styles.dateGrid}>
              <div className={styles.dateSubGroup}>
                <span className={styles.dateSubLabel}>Desde:</span>
                <input
                  type="date"
                  className={styles.input}
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.dateSubGroup}>
                <span className={styles.dateSubLabel}>Hasta:</span>
                <input
                  type="date"
                  className={styles.input}
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Columna Derecha: Tabla y Resultados */}
        <section className={styles.tableArea}>
          <div className={styles.tableCard}>
            {loading ? (
              <div className={styles.stateContainer}>
                <p>Cargando pacientes...</p>
              </div>
            ) : pacientes.length === 0 ? (
              <div className={styles.stateContainer}>
                <svg
                  className={styles.stateIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>
                  No se encontraron pacientes
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  Ajusta los filtros o registra un nuevo paciente con el botón superior.
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Apellido y Nombre</th>
                      <th>Sexo</th>
                      <th>Edad</th>
                      <th>F. Registro</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className={styles.dniBadge}>{p.dni}</span>
                        </td>
                        <td>
                          <span className={styles.pacienteNombre}>
                            {p.apellido}, {p.nombre}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.sexoBadge} ${
                              p.sexo === 'Femenino' ? styles.sexoF : styles.sexoM
                            }`}
                          >
                            {p.sexo}
                          </span>
                        </td>
                        <td>{p.edad} años</td>
                        <td>{formatearFecha(p.fechaCarga)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className={styles.btnAction}
                            onClick={() => handleVerFicha(p)}
                            title="Ver historia clínica"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>Ficha</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {!loading && pacientes.length > 0 && (
              <div className={styles.pagination}>
                <span>
                  Total: <strong>{totalCount}</strong> {totalCount === 1 ? 'paciente' : 'pacientes'} (Página {page} de {totalPages})
                </span>
                <div className={styles.paginationButtons}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PacientesPage;
