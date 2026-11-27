import { useEffect, useState } from 'react'

/** Devuelve `value` recién cuando dejó de cambiar durante `delay` ms (ej. para no consultar la API en cada tecla). */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
