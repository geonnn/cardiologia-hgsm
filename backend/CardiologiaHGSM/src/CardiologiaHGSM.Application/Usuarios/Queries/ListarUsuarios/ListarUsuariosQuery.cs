namespace CardiologiaHGSM.Application.Usuarios.Queries.ListarUsuarios;

// RF-08: orden (08.1), rango de fecha de carga (08.2) y búsqueda por email, nombre y/o apellido (08.3)
public sealed record ListarUsuariosQuery(
    int Page = 1,
    int PageSize = 10,
    OrdenUsuarios Orden = OrdenUsuarios.ApellidoAsc,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    string? Email = null,
    string? Nombre = null,
    string? Apellido = null
);
