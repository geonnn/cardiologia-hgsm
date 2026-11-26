import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSearchSelect.module.css';

interface OptionItem {
  id: number;
  nombre: string;
}

interface MultiSearchSelectProps {
  label: string;
  placeholder?: string;
  options: OptionItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export const MultiSearchSelect: React.FC<MultiSearchSelectProps> = ({
  label,
  placeholder = 'Buscar y seleccionar opciones...',
  options,
  selectedIds,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Opciones disponibles (que no están ya seleccionadas y coinciden con la búsqueda)
  const availableOptions = options.filter(
    (opt) =>
      !selectedIds.includes(opt.id) &&
      opt.nombre.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  const handleAdd = (id: number) => {
    onChange([...selectedIds, id]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemove = (id: number) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>{label}</label>

      {/* Etiquetas / Chips de las opciones seleccionadas */}
      {selectedOptions.length > 0 && (
        <div className={styles.chipsContainer}>
          {selectedOptions.map((opt) => (
            <span key={opt.id} className={styles.chip}>
              <span>{opt.nombre}</span>
              <button
                type="button"
                className={styles.chipRemoveBtn}
                onClick={() => handleRemove(opt.id)}
                title="Quitar"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Barra de búsqueda interactiva */}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder={selectedOptions.length === 0 ? placeholder : 'Buscar más opciones...'}
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
        />
        {isOpen && (
          <ul className={styles.dropdown}>
            {availableOptions.length > 0 ? (
              availableOptions.map((opt) => (
                <li
                  key={opt.id}
                  className={styles.optionItem}
                  onClick={() => handleAdd(opt.id)}
                >
                  <span>{opt.nombre}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ Seleccionar</span>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>
                {options.length === selectedIds.length
                  ? 'Todas las opciones han sido seleccionadas'
                  : 'No se encontraron coincidencias'}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSearchSelect;
