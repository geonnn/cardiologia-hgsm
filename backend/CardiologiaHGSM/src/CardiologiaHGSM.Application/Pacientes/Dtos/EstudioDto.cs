using CardiologiaHGSM.Application.Catalogos.Dtos;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record EstudioDto(
    Guid Id,
    Guid PacienteId,
    TipoEstudioDto TipoEstudio,
    string Titulo,
    DateOnly Fecha,
    string Descripcion)
{
    public static EstudioDto FromEntity(Estudio estudio) => new(
        estudio.Id,
        estudio.PacienteId,
        TipoEstudioDto.FromEntity(estudio.TipoEstudio),
        estudio.Titulo,
        estudio.Fecha,
        estudio.Descripcion
    );
}
