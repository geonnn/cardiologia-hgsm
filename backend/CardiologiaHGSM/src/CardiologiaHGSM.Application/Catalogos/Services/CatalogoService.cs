using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using ErrorOr;

namespace CardiologiaHGSM.Application.Catalogos.Services;

public class CatalogoService<TEntity, TId>(
    ICatalogoRepository<TEntity, TId> repository,
    IUnitOfWork unitOfWork)
    where TEntity : class, ICatalogo<TEntity, TId>
    where TId : struct
{
    public async Task<IReadOnlyList<TDto>> ListarAsync<TDto>(
        Func<TEntity, TDto> mapper,
        string? busqueda = null,
        CancellationToken ct = default)
    {
        var entidades = await repository.ListarAsync(busqueda, ct);
        return entidades.Select(mapper).ToList();
    }

    public async Task<ErrorOr<TId>> CrearAsync(string nombre, CancellationToken ct = default)
    {
        var crearResult = TEntity.Crear(nombre);
        if (crearResult.IsError)
            return crearResult.Errors;

        if (await repository.ExisteNombreAsync(crearResult.Value.Nombre, ct: ct))
            return CatalogoErrors.NombreDuplicado;

        repository.Add(crearResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return crearResult.Value.Id;
    }

    public async Task<ErrorOr<Success>> ModificarAsync(TId id, string nombre, CancellationToken ct = default)
    {
        var entidad = await repository.GetByIdAsync(id, ct);
        if (entidad is null)
            return CatalogoErrors.NoEncontrado;

        var modificarResult = entidad.Modificar(nombre);
        if (modificarResult.IsError)
            return modificarResult.Errors;

        if (await repository.ExisteNombreAsync(entidad.Nombre, excluirId: id, ct: ct))
            return CatalogoErrors.NombreDuplicado;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    public async Task<ErrorOr<Success>> EliminarAsync(TId id, CancellationToken ct = default)
    {
        var entidad = await repository.GetByIdAsync(id, ct);
        if (entidad is null)
            return CatalogoErrors.NoEncontrado;

        if (await repository.EstaEnUsoAsync(id, ct))
            return CatalogoErrors.EnUso;

        repository.Remove(entidad);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
