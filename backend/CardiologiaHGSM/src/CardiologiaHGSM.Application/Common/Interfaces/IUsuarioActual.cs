namespace CardiologiaHGSM.Application.Common.Interfaces;

/// <summary>
/// Usuario autenticado en el request actual. Id es null si no hay sesión.
/// </summary>
public interface IUsuarioActual
{
    Guid? Id { get; }
}
