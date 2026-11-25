using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Pacientes;

public sealed record ModificarContactoRequest(
    [Required] string Nombre,
    [Required] string Telefono,
    string? Apellido = null,
    string? Parentesco = null
);
