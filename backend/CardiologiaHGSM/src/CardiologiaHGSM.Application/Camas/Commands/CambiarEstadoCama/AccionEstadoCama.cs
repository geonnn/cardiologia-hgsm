namespace CardiologiaHGSM.Application.Camas.Commands.CambiarEstadoCama;

// Transiciones de estado que se pueden hacer manualmente sobre una cama (RF-27 a RF-30).
// Ocupar/Liberar no están acá porque dependen de crear o finalizar una internación.
public enum AccionEstadoCama
{
    BloquearPorAislamiento,
    Desbloquear,
    Deshabilitar,
    Habilitar
}
