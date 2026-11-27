using CardiologiaHGSM.Application.Camas;
using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearInternacion;

public class CrearInternacionHandler(
    IPacienteRepository pacienteRepository,
    ICamaRepository camaRepository,
    IMotivoInternacionRepository motivoInternacionRepository,
    IObraSocialRepository obraSocialRepository,
    IInternacionRepository internacionRepository,
    ITratamientoRepository tratamientoRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearInternacionCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        CrearInternacionCommand command,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(command.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        if (await internacionRepository.ExisteActivaParaPacienteAsync(command.PacienteId, ct))
            return InternacionErrors.PacienteYaInternado;

        var cama = await camaRepository.GetByIdAsync(command.CamaId, ct);
        if (cama is null)
            return CamaErrors.NoEncontrada;

        Cama? camaAislamiento = null;
        if (command.CamaAislamientoId is { } camaAislamientoId)
        {
            if (camaAislamientoId == command.CamaId)
                return InternacionErrors.CamaAislamientoIgualACamaAsignada;

            camaAislamiento = await camaRepository.GetByIdAsync(camaAislamientoId, ct);
            if (camaAislamiento is null)
                return CamaErrors.NoEncontrada;
        }

        if (command.ObraSocialId is { } obraSocialId &&
            !await obraSocialRepository.ExisteAsync(obraSocialId, ct))
            return InternacionErrors.ObraSocialNoEncontrada;

        var idsMotivos = command.MotivoInternacionIds?.Distinct().ToList() ?? [];
        var motivos = idsMotivos.Count > 0
            ? await motivoInternacionRepository.GetByIdsAsync(idsMotivos, ct)
            : [];

        if (motivos.Count != idsMotivos.Count)
            return InternacionErrors.MotivoNoEncontrado;

        var ahora = DateTimeOffset.UtcNow;
        var fechaIngreso = FechaEntrada.AjustarDesfasajeReloj(command.FechaInternacion, ahora);
        var manejo = command.Manejo ?? cama.Sector;

        var internacionResult = Internacion.Crear(
            command.PacienteId,
            cama.Id,
            manejo,
            command.EnfermedadActual,
            motivos,
            fechaIngreso,
            command.ObraSocialId,
            command.Aislamiento,
            command.ParametrosAntropometria,
            command.TratamientoPrevio,
            command.Observaciones,
            ahora);

        if (internacionResult.IsError)
            return internacionResult.Errors;

        var internacion = internacionResult.Value;

        Tratamiento? tratamientoInicial = null;
        if (!string.IsNullOrWhiteSpace(command.TratamientoActual))
        {
            var tratamientoResult = Tratamiento.Crear(
                internacion.Id,
                command.TratamientoActual,
                fecha: null,
                ahora: ahora);

            if (tratamientoResult.IsError)
                return tratamientoResult.Errors;

            tratamientoInicial = tratamientoResult.Value;
        }

        var ocuparResult = cama.Ocupar();
        if (ocuparResult.IsError)
            return ocuparResult.Errors;

        if (camaAislamiento is not null)
        {
            var bloquearResult = camaAislamiento.BloquearPorAislamiento();
            if (bloquearResult.IsError)
                return bloquearResult.Errors;
        }

        internacionRepository.Add(internacion);
        if (tratamientoInicial is not null)
            tratamientoRepository.Add(tratamientoInicial);

        await unitOfWork.SaveChangesAsync(ct);

        return internacion.Id;
    }
}
