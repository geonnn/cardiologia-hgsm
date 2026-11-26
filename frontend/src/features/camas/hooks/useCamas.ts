import { useState } from 'react'
import { SECTORES } from '../constants'
import type { Cama, EstadoCama, FiltroEstado, NuevaCama, Sector } from '../types'
import { contarPorEstado, ordenarCamas } from '../utils'

/** Estado de la vista de camas: sector seleccionado, filtro, alta y cambios de estado. */
export function useCamas(camasIniciales: Cama[]) {
  const [camas, setCamas] = useState(camasIniciales)
  const [sector, setSector] = useState<Sector>(SECTORES[0])
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')

  const camasDelSector = camas.filter((c) => c.sector === sector)
  const conteos = contarPorEstado(camasDelSector)
  const visibles = camasDelSector.filter((c) => filtro === 'todos' || c.estado === filtro).sort(ordenarCamas)
  const totalPorSector = (s: Sector) => camas.filter((c) => c.sector === s).length

  const cambiarSector = (nuevo: Sector) => {
    setSector(nuevo)
    setFiltro('todos')
  }

  const cambiarEstado = (id: string, estado: EstadoCama) =>
    setCamas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)))

  /** RF-10: la cama se crea en estado "disponible". Muestra su sector para que quede visible. */
  const crearCama = ({ numero, sector: sectorCama }: NuevaCama): Cama => {
    const nueva: Cama = { id: crypto.randomUUID(), numero, sector: sectorCama, estado: 'disponible' }
    setCamas((prev) => [...prev, nueva])
    cambiarSector(sectorCama)
    return nueva
  }

  return { camas, sector, filtro, conteos, visibles, totalPorSector, cambiarSector, setFiltro, cambiarEstado, crearCama }
}
