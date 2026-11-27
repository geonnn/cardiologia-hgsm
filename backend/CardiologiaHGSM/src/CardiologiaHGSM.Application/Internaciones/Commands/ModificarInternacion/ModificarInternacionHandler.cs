using CardiologiaHGSM.Application.Camas;
using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.ModificarInternacion;

public class ModificarInternacionHandler(
    IInternacionRepository internacionRepository,
    ICamaRepository camaRepository,
    IMotivoInternacionRepository motivoInternacionRepository,
    IObraSocialRepository obraSocialRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<ModificarInternacionCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        ModificarInternacionCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

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

        var modificarResult = internacion.Modificar(
            fechaIngreso,
            command.Manejo,
            command.EnfermedadActual,
            command.ObraSocialId,
            command.Aislamiento,
            command.ParametrosAntropometria,
            command.TratamientoPrevio,
            command.Observaciones,
            ahora);

        if (modificarResult.IsError)
            return modificarResult.Errors;

        var motivosResult = internacion.ReemplazarMotivosInternacion(motivos);
        if (motivosResult.IsError)
            return motivosResult.Errors;

        // Pase o intercambio automático (swap) de cama (RF-49)
        if (command.CamaId != internacion.CamaId)
        {
            var camaDestino = await camaRepository.GetByIdAsync(command.CamaId, ct);
            if (camaDestino is null)
                return CamaErrors.NoEncontrada;

            var camaOrigenId = internacion.CamaId;

            if (camaDestino.EstadoCama.Tipo == EstadoCamaTipo.Disponible)
            {
                var camaOrigen = await camaRepository.GetByIdAsync(camaOrigenId, ct);
                if (camaOrigen is null)
                    return CamaErrors.NoEncontrada;

                var liberarResult = camaOrigen.Liberar();
                if (liberarResult.IsError)
                    return liberarResult.Errors;

                var ocuparResult = camaDestino.Ocupar();
                if (ocuparResult.IsError)
                    return ocuparResult.Errors;

                var cambiarResult = internacion.CambiarCama(camaDestino.Id);
                if (cambiarResult.IsError)
                    return cambiarResult.Errors;
            }
            else if (camaDestino.EstadoCama.Tipo == EstadoCamaTipo.Ocupada)
            {
                var internacionDestino = await internacionRepository.ObtenerActivaPorCamaAsync(camaDestino.Id, ct);
                if (internacionDestino is null)
                    return InternacionErrors.CamaOcupadaSinInternacionActiva;

                var cambiarOrigenResult = internacion.CambiarCama(camaDestino.Id);
                if (cambiarOrigenResult.IsError)
                    return cambiarOrigenResult.Errors;

                var cambiarDestinoResult = internacionDestino.CambiarCama(camaOrigenId);
                if (cambiarDestinoResult.IsError)
                    return cambiarDestinoResult.Errors;
            }
            else
            {
                // EnAislamiento o Deshabilitada: delega a la máquina de estados para devolver el error de dominio.
                var ocuparResult = camaDestino.Ocupar();
                if (ocuparResult.IsError)
                    return ocuparResult.Errors;
            }
        }

        // Bloqueo opcional de cama por aislamiento (RF-27)
        if (command.CamaAislamientoId is { } camaAislamientoId)
        {
            if (camaAislamientoId == internacion.CamaId)
                return InternacionErrors.CamaAislamientoIgualACamaAsignada;

            var camaAislamiento = await camaRepository.GetByIdAsync(camaAislamientoId, ct);
            if (camaAislamiento is null)
                return CamaErrors.NoEncontrada;

            var bloquearResult = camaAislamiento.BloquearPorAislamiento();
            if (bloquearResult.IsError)
                return bloquearResult.Errors;
        }

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
