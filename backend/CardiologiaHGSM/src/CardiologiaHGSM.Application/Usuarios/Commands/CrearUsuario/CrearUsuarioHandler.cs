using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CrearUsuario;

public class CrearUsuarioHandler(
    UserManager<Usuario> userManager,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearUsuarioCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(CrearUsuarioCommand command, CancellationToken ct = default)
    {
        var crear = Usuario.Crear(command.Nombre, command.Apellido, command.Email);
        if (crear.IsError)
            return crear.Errors;

        var usuario = crear.Value;

        // Crear el usuario y asignarle el rol en una sola transacción:
        // si falla la asignación del rol no queda un usuario sin rol.
        return await unitOfWork.ExecuteInTransactionAsync<Guid>(async _ =>
        {
            // valida formato y unicidad del email y la política de contraseñas (RF-02)
            var resultado = await userManager.CreateAsync(usuario, command.Password);
            if (!resultado.Succeeded)
                return resultado.ToErrors();

            var resultadoRol = await userManager.AddToRoleAsync(usuario, Rol.Usuario);
            if (!resultadoRol.Succeeded)
                return resultadoRol.ToErrors();

            return usuario.Id;
        }, ct);
    }
}
