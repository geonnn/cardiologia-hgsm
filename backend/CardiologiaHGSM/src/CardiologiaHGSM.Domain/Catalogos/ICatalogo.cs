namespace CardiologiaHGSM.Domain.Catalogos;

public interface ICatalogo<TSelf, TId>
    where TSelf : class, ICatalogo<TSelf, TId>
    where TId : struct
{
    TId Id { get; }
    string Nombre { get; }
    static abstract ErrorOr<TSelf> Crear(string nombre);
    ErrorOr<Success> Modificar(string nombre);
}
