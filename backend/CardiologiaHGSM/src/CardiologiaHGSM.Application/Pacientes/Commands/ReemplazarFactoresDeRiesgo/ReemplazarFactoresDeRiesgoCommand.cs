namespace CardiologiaHGSM.Application.Pacientes.Commands.ReemplazarFactoresDeRiesgo;

public sealed record ReemplazarFactoresDeRiesgoCommand(
    Guid PacienteId,
    IReadOnlyCollection<int> FactorDeRiesgoIds
);
