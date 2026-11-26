import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchSelect.module.css';

interface OptionItem {
  id: number | string;
  nombre: string;
}

interface SearchSelectProps {
  label: string;
  placeholder?: string;
  options: OptionItem[];
  value: number | string | undefined | null;
  onChange: (value: number | undefined) => void;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  placeholder = 'Buscar opción...',
  options,
  value,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = options.filter((opt) =>
    opt.nombre.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSelect = (id: number | string) => {
    onChange(typeof id === 'number' ? id : parseInt(id as string, 10));
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setSearchTerm('');
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>{label}</label>

      {selectedOption ? (
        <div className={styles.selectedTag}>
          <span className={styles.selectedText}>{selectedOption.nombre}</span>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={handleClear}
            title="Quitar filtro"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
          />
          {isOpen && (
            <ul className={styles.dropdown}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={opt.id}
                    className={styles.optionItem}
                    onClick={() => handleSelect(opt.id)}
                  >
                    {opt.nombre}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No hay coincidencias</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
