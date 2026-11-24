using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Catalogos;

public sealed record CatalogoNombreRequest(
    [Required] string Nombre
);
