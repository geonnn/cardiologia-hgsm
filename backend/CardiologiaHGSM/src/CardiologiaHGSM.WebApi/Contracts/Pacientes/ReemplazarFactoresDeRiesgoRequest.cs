using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Pacientes;

public sealed record ReemplazarFactoresDeRiesgoRequest(
    [Required] IReadOnlyCollection<int> FactorDeRiesgoIds
);
