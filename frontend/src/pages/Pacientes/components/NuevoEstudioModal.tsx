import React, { useState, useEffect } from 'react';
import { crearEstudio } from '../../../services/pacienteService';
import { listarTiposEstudio } from '../../../services/catalogoService';
import type { TipoEstudio } from '../../../types/paciente';
import styles from './NuevoEstudioModal.module.css';

interface NuevoEstudioModalProps {
  isOpen: boolean;
  pacienteId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevoEstudioModal: React.FC<NuevoEstudioModalProps> = ({
  isOpen,
  pacienteId,
  onClose,
  onSuccess,
}) => {
  const [tiposEstudio, setTiposEstudio] = useState<TipoEstudio[]>([]);
  const [tipoEstudioId, setTipoEstudioId] = useState<number | ''>('');
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const hoyStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      listarTiposEstudio().then((tipos) => {
        setTiposEstudio(tipos);
        if (tipos.length > 0) setTipoEstudioId(tipos[0].id);
      });
      setTitulo('');
      setFecha(hoyStr);
      setDescripcion('');
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, hoyStr]);

  if (!isOpen) return null;

  const validar = (): boolean => {
    const errs: Record<string, string> = {};

    if (!tipoEstudioId) {
      errs.tipoEstudioId = 'Debe seleccionar un tipo de estudio.';
    }

    if (!titulo.trim()) {
      errs.titulo = 'El título es obligatorio.';
    } else if (titulo.length > 100) {
      errs.titulo = 'Máximo 100 caracteres.';
    }

    if (!fecha) {
      errs.fecha = 'La fecha es obligatoria.';
    } else if (fecha > hoyStr) {
      errs.fecha = 'La fecha no puede ser posterior a la actual.';
    }

    if (!descripcion.trim()) {
      errs.descripcion = 'La descripción o informe es obligatorio.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validar()) return;

    setSubmitting(true);
    try {
      await crearEstudio(pacienteId, {
        tipoEstudioId: Number(tipoEstudioId),
        titulo: titulo.trim(),
        fecha: new Date(fecha).toISOString(),
        descripcion: descripcion.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el estudio';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Agregar Estudio Médico (RF-35)</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          {serverError && <div className={styles.alert}>⚠️ {serverError}</div>}

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tipo de Estudio <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.tipoEstudioId ? styles.inputError : ''}`}
                value={tipoEstudioId}
                onChange={(e) => setTipoEstudioId(Number(e.target.value))}
              >
                {tiposEstudio.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {errors.tipoEstudioId && <p className={styles.errorText}>{errors.tipoEstudioId}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Fecha del Estudio <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                max={hoyStr}
                className={`${styles.input} ${errors.fecha ? styles.inputError : ''}`}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              {errors.fecha && <p className={styles.errorText}>{errors.fecha}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Título del Estudio <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Ej: ETT de control post-infarto"
              className={`${styles.input} ${errors.titulo ? styles.inputError : ''}`}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            {errors.titulo && <p className={styles.errorText}>{errors.titulo}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Informe / Conclusión <span className={styles.required}>*</span>
            </label>
            <textarea
              placeholder="Detalle de hallazgos, fracción de eyección (FEVI), mediciones, etc..."
              className={`${styles.textarea} ${errors.descripcion ? styles.inputError : ''}`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            {errors.descripcion && <p className={styles.errorText}>{errors.descripcion}</p>}
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
              {submitting ? 'Guardando...' : 'Guardar Estudio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoEstudioModal;
