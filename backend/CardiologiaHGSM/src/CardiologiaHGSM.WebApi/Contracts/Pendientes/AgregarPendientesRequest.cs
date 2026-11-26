using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Pendientes;

public sealed record AgregarPendienteRequest(
    [Required] string Titulo,
    [Required] string Descripcion
);