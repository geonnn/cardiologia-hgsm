using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Pacientes;

public sealed record AgregarContactoRequest(
    [Required] string Nombre,
    [Required] string Telefono,
    string? Apellido = null,
    string? Parentesco = null
);
