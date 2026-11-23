using ErrorOr;

namespace CardiologiaHGSM.Application.Common.Interfaces;

public interface ICommandHandler<in TCommand, TResponse>
{
    Task<ErrorOr<TResponse>> HandleAsync(TCommand command, CancellationToken ct = default);
}

// sobrecarga para comandos que no devuelven datos
public interface ICommandHandler<in TCommand> : ICommandHandler<TCommand, Success>;