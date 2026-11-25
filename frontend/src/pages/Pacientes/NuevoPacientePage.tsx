import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPaciente } from '../../services/pacienteService';
import { listarFactoresDeRiesgo, obtenerOCrearMedicoDeCabecera } from '../../services/catalogoService';
import MultiSearchSelect from '../../components/SearchSelect/MultiSearchSelect';
import type { Sexo, Contacto, FactorDeRiesgo } from '../../types/paciente';
import styles from './NuevoPacientePage.module.css';

export const NuevoPacientePage: React.FC = () => {
  const navigate = useNavigate();

  // Datos personales (Obligatorios según RF-24)
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [sexo, setSexo] = useState<Sexo>('Masculino');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  // Datos opcionales
  const [medicoDeCabecera, setMedicoDeCabecera] = useState('');
  const [antecedentes, setAntecedentes] = useState('');
  const [contactos, setContactos] = useState<Omit<Contacto, 'id'>[]>([]);
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<number[]>([]);

  // Catálogo de factores de riesgo
  const [factoresDisponibles, setFactoresDisponibles] = useState<FactorDeRiesgo[]>([]);

  // Estados de control
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Fecha máxima permitida (hoy)
  const hoyStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    listarFactoresDeRiesgo().then(setFactoresDisponibles);
  }, []);

  // Manejo de contactos dinámicos (0 a 5)
  const handleAgregarContacto = () => {
    if (contactos.length >= 5) return;
    setContactos([
      ...contactos,
      { nombre: '', telefono: '', apellido: '', parentesco: '' },
    ]);
  };

  const handleEliminarContacto = (index: number) => {
    setContactos(contactos.filter((_, i) => i !== index));
  };

  const handleContactoChange = (
    index: number,
    field: keyof Omit<Contacto, 'id'>,
    value: string
  ) => {
    const updated = [...contactos];
    updated[index] = { ...updated[index], [field]: value };
    setContactos(updated);
  };

  // Validaciones del formulario
  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (nombre.length > 50) {
      newErrors.nombre = 'Máximo 50 caracteres.';
    }

    if (!apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio.';
    } else if (apellido.length > 50) {
      newErrors.apellido = 'Máximo 50 caracteres.';
    }

    const dniLimpio = dni.trim();
    if (!dniLimpio) {
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (dniLimpio.length < 7 || dniLimpio.length > 9) {
      newErrors.dni = 'Debe tener entre 7 y 9 caracteres.';
    }

    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    } else if (fechaNacimiento > hoyStr) {
      newErrors.fechaNacimiento = 'No puede ser posterior a la fecha actual.';
    }

    if (medicoDeCabecera.length > 100) {
      newErrors.medicoDeCabecera = 'Máximo 100 caracteres.';
    }

    // Validar contactos si se agregaron
    contactos.forEach((c, idx) => {
      if (!c.nombre.trim()) {
        newErrors[`contacto_${idx}_nombre`] = 'El nombre del contacto es obligatorio.';
      }
      if (!c.telefono.trim()) {
        newErrors[`contacto_${idx}_telefono`] = 'El teléfono es obligatorio.';
      } else if (!/^\d+$/.test(c.telefono.trim())) {
        newErrors[`contacto_${idx}_telefono`] = 'Sólo debe contener números.';
      } else if (c.telefono.trim().length > 15) {
        newErrors[`contacto_${idx}_telefono`] = 'Máximo 15 dígitos.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validarFormulario()) return;

    setSubmitting(true);
    try {
      // 1. Si se ingresó médico de cabecera como texto, obtener o registrar su ID
      let medicoId: string | undefined = undefined;
      if (medicoDeCabecera.trim()) {
        const idObtenido = await obtenerOCrearMedicoDeCabecera(medicoDeCabecera.trim());
        if (idObtenido) medicoId = idObtenido;
      }

      // 2. Registrar el paciente
      await crearPaciente({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        sexo,
        fechaNacimiento,
        antecedentes: antecedentes.trim() || undefined,
        medicoDeCabeceraId: medicoId,
        contactos: contactos.map((c) => ({
          nombre: c.nombre.trim(),
          telefono: c.telefono.trim(),
          apellido: c.apellido?.trim() || undefined,
          parentesco: c.parentesco?.trim() || undefined,
        })),
        factoresDeRiesgoIds: factoresSeleccionados,
      });

      // Redirigir al listado de pacientes tras guardar exitosamente
      navigate('/pacientes');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al guardar el paciente';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>Registrar Nuevo Paciente</h1>
      </div>

      {serverError && (
        <div className={styles.serverErrorAlert}>
          ⚠️ {serverError}
        </div>
      )}

      {/* Tarjeta de Formulario Principal */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* 1. Datos Personales */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>1. Datos Personales y Filiatorios</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Campos obligatorios
            </span>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                maxLength={50}
                className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errors.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Apellido <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                maxLength={50}
                className={`${styles.input} ${errors.apellido ? styles.inputError : ''}`}
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
              {errors.apellido && <p className={styles.errorText}>{errors.apellido}</p>}
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                DNI <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                minLength={7}
                maxLength={9}
                className={`${styles.input} ${errors.dni ? styles.inputError : ''}`}
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              {errors.dni && <p className={styles.errorText}>{errors.dni}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Sexo <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={sexo}
                onChange={(e) => setSexo(e.target.value as Sexo)}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Fecha de Nacimiento <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                max={hoyStr}
                className={`${styles.input} ${errors.fechaNacimiento ? styles.inputError : ''}`}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
              {errors.fechaNacimiento && (
                <p className={styles.errorText}>{errors.fechaNacimiento}</p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Perfil Clínico Inicial */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>2. Perfil Clínico Inicial (Opcional)</h2>
          </div>

          <div className={styles.grid2}>
            {/* Médico de cabecera como campo de texto */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Médico de Cabecera</label>
              <input
                type="text"
                maxLength={100}
                className={`${styles.input} ${errors.medicoDeCabecera ? styles.inputError : ''}`}
                placeholder="Nombre completo"
                value={medicoDeCabecera}
                onChange={(e) => setMedicoDeCabecera(e.target.value)}
              />
              {errors.medicoDeCabecera && (
                <p className={styles.errorText}>{errors.medicoDeCabecera}</p>
              )}
            </div>

            {/* Factores de riesgo cardiovascular con buscador múltiple */}
            <div className={styles.formGroup}>
              <MultiSearchSelect
                label="Factores de Riesgo Cardiovascular"
                placeholder="Factores de riesgo"
                options={factoresDisponibles}
                selectedIds={factoresSeleccionados}
                onChange={setFactoresSeleccionados}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Antecedentes</label>
            <textarea
              className={styles.textarea}
              placeholder="Cirugías cardíacas previas, factores hereditarios, patologías crónicas, alergias..."
              value={antecedentes}
              onChange={(e) => setAntecedentes(e.target.value)}
            />
          </div>
        </section>

        {/* 3. Contactos Familiares */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>3. Contactos del Paciente</h2>
            <span className={styles.counterBadge}>
              {contactos.length} de 5 contactos
            </span>
          </div>

          {contactos.length > 0 && (
            <div className={styles.contactosList}>
              {contactos.map((c, idx) => (
                <div key={idx} className={styles.contactoCard}>
                  <div className={styles.contactoHeader}>
                    <span className={styles.contactoNumber}>
                      Contacto #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className={styles.btnRemoveContacto}
                      onClick={() => handleEliminarContacto(idx)}
                    >
                      ✕ Quitar
                    </button>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Nombre <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        placeholder="Nombre del contacto"
                        className={`${styles.input} ${
                          errors[`contacto_${idx}_nombre`] ? styles.inputError : ''
                        }`}
                        value={c.nombre}
                        onChange={(e) =>
                          handleContactoChange(idx, 'nombre', e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Teléfono <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="Teléfono del contacto"
                        className={`${styles.input} ${
                          errors[`contacto_${idx}_telefono`] ? styles.inputError : ''
                        }`}
                        value={c.telefono}
                        onChange={(e) =>
                          handleContactoChange(idx, 'telefono', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Apellido (Opcional)</label>
                      <input
                        type="text"
                        maxLength={50}
                        placeholder="Apellido del contacto"
                        className={styles.input}
                        value={c.apellido || ''}
                        onChange={(e) =>
                          handleContactoChange(idx, 'apellido', e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Parentesco (Opcional)</label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="Parentesco"
                        className={styles.input}
                        value={c.parentesco || ''}
                        onChange={(e) =>
                          handleContactoChange(idx, 'parentesco', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {contactos.length < 5 && (
            <button
              type="button"
              className={styles.btnAddContacto}
              onClick={handleAgregarContacto}
            >
              + Agregar Contacto Familiar
            </button>
          )}
        </section>

        {/* Botones de acción */}
        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => navigate('/pacientes')}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={submitting}
          >
            {submitting ? 'Guardando Paciente...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoPacientePage;
