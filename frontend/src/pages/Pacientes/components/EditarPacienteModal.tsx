import React, { useState, useEffect } from 'react';
import { modificarPaciente, reemplazarFactoresDeRiesgo } from '../../../services/pacienteService';
import { listarFactoresDeRiesgo, obtenerOCrearMedicoDeCabecera } from '../../../services/catalogoService';
import MultiSearchSelect from '../../../components/SearchSelect/MultiSearchSelect';
import type { PacienteDetalle, Sexo, FactorDeRiesgo } from '../../../types/paciente';
import styles from './EditarPacienteModal.module.css';

interface EditarPacienteModalProps {
  isOpen: boolean;
  paciente: PacienteDetalle;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditarPacienteModal: React.FC<EditarPacienteModalProps> = ({
  isOpen,
  paciente,
  onClose,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState(paciente.nombre);
  const [apellido, setApellido] = useState(paciente.apellido);
  const [dni, setDni] = useState(paciente.dni);
  const [sexo, setSexo] = useState<Sexo>(paciente.sexo);
  const [fechaNacimiento, setFechaNacimiento] = useState(paciente.fechaNacimiento);
  const [medicoDeCabecera, setMedicoDeCabecera] = useState(paciente.medicoDeCabecera?.nombre || '');
  const [antecedentes, setAntecedentes] = useState(paciente.antecedentes || '');
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<number[]>(
    paciente.factoresDeRiesgo.map((f) => f.id)
  );

  const [factoresDisponibles, setFactoresDisponibles] = useState<FactorDeRiesgo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const hoyStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      listarFactoresDeRiesgo().then(setFactoresDisponibles);
      setNombre(paciente.nombre);
      setApellido(paciente.apellido);
      setDni(paciente.dni);
      setSexo(paciente.sexo);
      setFechaNacimiento(paciente.fechaNacimiento);
      setMedicoDeCabecera(paciente.medicoDeCabecera?.nombre || '');
      setAntecedentes(paciente.antecedentes || '');
      setFactoresSeleccionados(paciente.factoresDeRiesgo.map((f) => f.id));
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, paciente]);

  if (!isOpen) return null;

  const validar = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'Obligatorio';
    if (!apellido.trim()) errs.apellido = 'Obligatorio';
    if (!dni.trim() || dni.trim().length < 7 || dni.trim().length > 9) errs.dni = '7 a 9 caracteres';
    if (!fechaNacimiento || fechaNacimiento > hoyStr) errs.fechaNacimiento = 'Fecha inválida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validar()) return;

    setSubmitting(true);
    try {
      let medicoId: string | undefined = undefined;
      if (medicoDeCabecera.trim()) {
        const id = await obtenerOCrearMedicoDeCabecera(medicoDeCabecera.trim());
        if (id) medicoId = id;
      }

      await modificarPaciente(paciente.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        sexo,
        fechaNacimiento,
        antecedentes: antecedentes.trim() || undefined,
        medicoDeCabeceraId: medicoId,
      });

      // Actualizar factores de riesgo
      await reemplazarFactoresDeRiesgo(paciente.id, factoresSeleccionados);

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al modificar datos del paciente';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Modificar Datos del Paciente (RF-25)</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          {serverError && <div className={styles.alert}>⚠️ {serverError}</div>}

          <h3 className={styles.sectionTitle}>Datos Personales</h3>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                maxLength={50}
                className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
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
                maxLength={9}
                className={`${styles.input} ${errors.dni ? styles.inputError : ''}`}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              {errors.dni && <p className={styles.errorText}>{errors.dni}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Sexo</label>
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
              <label className={styles.label}>F. Nacimiento</label>
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

          <h3 className={styles.sectionTitle}>Perfil Clínico</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Médico de Cabecera</label>
            <input
              type="text"
              maxLength={100}
              placeholder="Nombre del médico..."
              className={styles.input}
              value={medicoDeCabecera}
              onChange={(e) => setMedicoDeCabecera(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <MultiSearchSelect
              label="Factores de Riesgo Cardiovascular"
              placeholder="Buscar factor de riesgo..."
              options={factoresDisponibles}
              selectedIds={factoresSeleccionados}
              onChange={setFactoresSeleccionados}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Antecedentes</label>
            <textarea
              className={styles.textarea}
              value={antecedentes}
              onChange={(e) => setAntecedentes(e.target.value)}
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPacienteModal;
