using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record ContactoDto(
    Guid Id,
    string Nombre,
    string? Apellido,
    string Telefono,
    string? Parentesco)
{
    public static ContactoDto FromEntity(Contacto contacto) => new(
        contacto.Id,
        contacto.Nombre,
        contacto.Apellido,
        contacto.Telefono,
        contacto.Parentesco
    );
}
