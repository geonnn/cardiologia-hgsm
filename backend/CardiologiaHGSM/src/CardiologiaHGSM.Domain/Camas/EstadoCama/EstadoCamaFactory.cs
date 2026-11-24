namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public static class EstadoCamaFactory
{
    public static IEstadoCama Crear(EstadoCamaTipo tipo) => tipo switch
    {
        EstadoCamaTipo.Disponible => new DisponibleState(),
        EstadoCamaTipo.Ocupada => new OcupadaState(),
        EstadoCamaTipo.EnAislamiento => new EnAislamientoState(),
        EstadoCamaTipo.Deshabilitada => new DeshabilitadaState(),
        _ => throw new ArgumentOutOfRangeException(nameof(tipo), tipo, "Estado de cama no soportado.")
    };
}
