using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CardiologiaHGSM.Infrastructure.Identity;

/// <summary>
/// Configuración de los tokens de acceso (sección "Jwt" de appsettings).
/// La clave no va en el repositorio: en producción se pasa por la variable de entorno Jwt__Key.
/// </summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    // HS256 necesita una clave de al menos 256 bits.
    public const int MinBytesClave = 32;

    public string Issuer { get; set; } = "cardiologia-hgsm";
    public string Audience { get; set; } = "cardiologia-hgsm";
    public string Key { get; set; } = string.Empty;
    public double ExpiracionHoras { get; set; } = 12;

    public SymmetricSecurityKey ObtenerClaveDeFirma() => new(Encoding.UTF8.GetBytes(Key));
}
