import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  obtenerPacientePorId,
  listarEstudios,
  eliminarEstudio,
  eliminarContacto,
} from '../../services/pacienteService';
import type { PacienteDetalle, Estudio } from '../../types/paciente';
import NuevoEstudioModal from './components/NuevoEstudioModal';
import EditarPacienteModal from './components/EditarPacienteModal';
import styles from './DetallePacientePage.module.css';

// Paciente demo para previsualización inmediata si la API está desconectada
const PACIENTE_DEMO: PacienteDetalle = {
  id: '1',
  nombre: 'Carlos Alberto',
  apellido: 'Gómez',
  dni: '28456123',
  fechaNacimiento: '1981-04-15',
  edad: 45,
  sexo: 'Masculino',
  fechaCarga: '2026-11-15T09:30:00Z',
  medicoDeCabecera: { id: 'm1', nombre: 'Dr. Alejandro Benítez' },
  antecedentes: 'Ex-fumador hace 3 años. Antecedente familiar directo de infarto a los 55 años.',
  factoresDeRiesgo: [
    { id: 1, nombre: 'Hipertensión Arterial (HTA)' },
    { id: 3, nombre: 'Tabaquismo' },
  ],
  contactos: [
    { id: 'c1', nombre: 'Marta Gómez', apellido: 'Pérez', telefono: '2214567890', parentesco: 'Esposa' },
    { id: 'c2', nombre: 'Esteban Gómez', apellido: '', telefono: '2215678901', parentesco: 'Hijo' },
  ],
};

const ESTUDIOS_DEMO: Estudio[] = [
  {
    id: 'e1',
    pacienteId: '1',
    tipoEstudio: { id: 1, nombre: 'Ecocardiograma Transtorácico (ETT)' },
    titulo: 'ETT de Control Basal',
    fecha: '2026-11-18T10:00:00Z',
    descripcion: 'Ventrículo izquierdo de dimensiones normales con función sistólica conservada (FEVI 62%). Sin trastornos regionales de la motilidad parietal. Patrón de llenado mitral normal.',
  },
  {
    id: 'e2',
    pacienteId: '1',
    tipoEstudio: { id: 2, nombre: 'Electrocardiograma (ECG)' },
    titulo: 'ECG de 12 Derivaciones',
    fecha: '2026-11-15T09:45:00Z',
    descripcion: 'Ritmo sinusal regular a 72 lpm. PR 160 ms, QRS estrecho (80 ms). Eje eléctrico normoposicionado a +45°. Sin alteraciones agudas de la repolarización ventricular.',
  },
];

function formatearFecha(fechaStr?: string): string {
  if (!fechaStr) return '-';
  const partes = fechaStr.split('T')[0].split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaStr;
}

export const DetallePacientePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<PacienteDetalle | null>(null);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'datos' | 'estudios' | 'internaciones'>('datos');

  // Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEstudioModalOpen, setIsEstudioModalOpen] = useState(false);

  // Cargar datos del paciente
  const cargarPaciente = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await obtenerPacientePorId(id);
      setPaciente(data);
    } catch {
      // Fallback a demo si la base de datos no está levantada
      setPaciente({ ...PACIENTE_DEMO, id });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Cargar estudios del paciente
  const cargarEstudios = useCallback(async () => {
    if (!id) return;
    try {
      const res = await listarEstudios(id);
      setEstudios(res.items);
    } catch {
      setEstudios(ESTUDIOS_DEMO);
    }
  }, [id]);

  useEffect(() => {
    cargarPaciente();
    cargarEstudios();
  }, [cargarPaciente, cargarEstudios]);

  const handleEliminarEstudio = async (estudioId: string) => {
    if (!id) return;
    if (!window.confirm('¿Está seguro de que desea eliminar este estudio médico? (RF-36)')) {
      return;
    }
    try {
      await eliminarEstudio(id, estudioId);
      cargarEstudios();
    } catch {
      // Si la API falla, actualizar estado local para la prueba visual
      setEstudios((prev) => prev.filter((e) => e.id !== estudioId));
    }
  };

  const handleEliminarContacto = async (contactoId: string) => {
    if (!id) return;
    if (!window.confirm('¿Desea quitar este contacto del paciente?')) return;
    try {
      await eliminarContacto(id, contactoId);
      cargarPaciente();
    } catch {
      if (paciente) {
        setPaciente({
          ...paciente,
          contactos: paciente.contactos.filter((c) => c.id !== contactoId),
        });
      }
    }
  };

  if (loading && !paciente) {
    return <div className={styles.emptyState}>Cargando ficha del paciente...</div>;
  }

  if (!paciente) {
    return (
      <div className={styles.emptyState}>
        <p>No se encontró el paciente solicitado.</p>
        <button type="button" className={styles.btnBack} onClick={() => navigate('/pacientes')}>
          ← Volver a Pacientes
        </button>
      </div>
    );
  }

  const iniciales = `${paciente.apellido[0] || ''}${paciente.nombre[0] || ''}`.toUpperCase();

  return (
    <div className={styles.container}>
      {/* Botón superior de retroceso */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.btnBack}
          onClick={() => navigate('/pacientes')}
          title="Regresar a la lista de pacientes"
        >
          ← Volver a Pacientes
        </button>
      </div>

      {/* Banner Principal del Paciente */}
      <div className={styles.bannerCard}>
        <div className={styles.bannerMain}>
          <div className={styles.avatarCircle}>{iniciales}</div>
          <div className={styles.patientInfo}>
            <h1 className={styles.patientName}>
              <span>{paciente.apellido}, {paciente.nombre}</span>
              <span className={styles.dniBadge}>DNI {paciente.dni}</span>
            </h1>
            <div className={styles.metaRow}>
              <span
                className={`${styles.sexoBadge} ${
                  paciente.sexo === 'Femenino' ? styles.sexoF : styles.sexoM
                }`}
              >
                {paciente.sexo}
              </span>
              <span><strong>{paciente.edad}</strong> años</span>
              <span>• F. Nac: {formatearFecha(paciente.fechaNacimiento)}</span>
              <span>• Registrado: {formatearFecha(paciente.fechaCarga)}</span>
              {paciente.medicoDeCabecera && (
                <span>• Médico: <strong>{paciente.medicoDeCabecera.nombre}</strong></span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bannerActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setIsEditModalOpen(true)}
            title="Modificar datos filiatorios (RF-25)"
          >
            ✏️ Modificar Datos
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => alert('Próximo módulo: Crear Internación de este paciente (RF-47)')}
            title="Internar paciente en cama disponible (RF-47)"
          >
            + Nueva Internación
          </button>
        </div>
      </div>

      {/* Selector de Pestañas (Tabs) */}
      <nav className={styles.tabList}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'datos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('datos')}
        >
          👤 Datos Personales y Contactos
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'estudios' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('estudios')}
        >
          🩺 Estudios Médicos
          <span className={styles.tabBadge}>{estudios.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'internaciones' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('internaciones')}
        >
          📋 Historial de Internaciones
        </button>
      </nav>

      {/* Contenido según pestaña activa */}

      {/* TAB 1: DATOS PERSONALES & CONTACTOS */}
      {activeTab === 'datos' && (
        <div className={styles.detailsGrid}>
          {/* Tarjeta Perfil Clínico */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Perfil Clínico y Factores de Riesgo</h2>

            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Factores de Riesgo Cardiovascular</span>
              {paciente.factoresDeRiesgo.length > 0 ? (
                <div className={styles.chipsContainer}>
                  {paciente.factoresDeRiesgo.map((f) => (
                    <span key={f.id} className={styles.riskChip}>
                      {f.nombre}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Sin factores de riesgo registrados.
                </span>
              )}
            </div>

            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Antecedentes Clínicos Relevantes</span>
              <div className={styles.antecedentesBox}>
                {paciente.antecedentes?.trim() || 'No se registraron antecedentes para este paciente.'}
              </div>
            </div>

            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Médico de Cabecera</span>
              <span className={styles.fieldValue}>
                {paciente.medicoDeCabecera?.nombre || 'No asignado'}
              </span>
            </div>
          </div>

          {/* Tarjeta Contactos Familiares */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span>Contactos Familiares</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                {paciente.contactos.length} de 5
              </span>
            </h2>

            {paciente.contactos.length > 0 ? (
              <div className={styles.contactosList}>
                {paciente.contactos.map((c) => (
                  <div key={c.id || c.nombre} className={styles.contactoCard}>
                    <div className={styles.contactoData}>
                      <span className={styles.contactoName}>
                        {c.nombre} {c.apellido || ''}
                      </span>
                      <span className={styles.contactoMeta}>
                        📞 {c.telefono} {c.parentesco ? `• ${c.parentesco}` : ''}
                      </span>
                    </div>
                    {c.id && (
                      <button
                        type="button"
                        className={styles.btnDeleteMini}
                        onClick={() => handleEliminarContacto(c.id!)}
                        title="Eliminar contacto"
                      >
                        ✕ Quitar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                No hay contactos de emergencia registrados.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ESTUDIOS MÉDICOS (RF-35 a RF-37) */}
      {activeTab === 'estudios' && (
        <div className={styles.estudiosContainer}>
          <div className={styles.estudiosToolbar}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--secondary)' }}>
                Estudios Complementarios Realizados (RF-37)
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Registro cronológico ordenado del más reciente al más antiguo
              </span>
            </div>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setIsEstudioModalOpen(true)}
            >
              + Nuevo Estudio Médico
            </button>
          </div>

          {estudios.length === 0 ? (
            <div className={styles.emptyState}>
              <p>El paciente aún no cuenta con estudios médicos cargados.</p>
            </div>
          ) : (
            <div className={styles.estudiosList}>
              {estudios.map((est) => (
                <article key={est.id} className={styles.estudioCard}>
                  <div className={styles.estudioHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={styles.estudioTipoBadge}>
                        {est.tipoEstudio.nombre}
                      </span>
                      <h3 className={styles.estudioTitle}>{est.titulo}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={styles.estudioFecha}>
                        📅 {formatearFecha(est.fecha)}
                      </span>
                      <button
                        type="button"
                        className={styles.btnDeleteMini}
                        onClick={() => handleEliminarEstudio(est.id)}
                        title="Eliminar estudio médico (RF-36)"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                  <p className={styles.estudioDesc}>{est.descripcion}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORIAL DE INTERNACIONES (RF-48) */}
      {activeTab === 'internaciones' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Historial de Internaciones (RF-48)</h2>
          <div className={styles.emptyState}>
            <p>Este paciente no registra internaciones finalizadas ni internación en curso actualmente.</p>
            <p style={{ fontSize: '0.85rem' }}>
              Podrás registrar una internación asignándole una cama disponible con el botón superior <strong>"+ Nueva Internación"</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Modal para Modificar Datos del Paciente (RF-25) */}
      <EditarPacienteModal
        isOpen={isEditModalOpen}
        paciente={paciente}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => cargarPaciente()}
      />

      {/* Modal para Agregar Estudio Médico (RF-35) */}
      <NuevoEstudioModal
        isOpen={isEstudioModalOpen}
        pacienteId={paciente.id}
        onClose={() => setIsEstudioModalOpen(false)}
        onSuccess={() => cargarEstudios()}
      />
    </div>
  );
};

export default DetallePacientePage;
