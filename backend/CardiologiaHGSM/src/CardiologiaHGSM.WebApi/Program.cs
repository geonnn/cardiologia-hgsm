using System.Text.Json.Serialization;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Infrastructure.Common;
using CardiologiaHGSM.Infrastructure.Identity;
using CardiologiaHGSM.WebApi.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        ));

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddAutenticacion();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// roles del sistema + administrador inicial (Seed:Admin)
await app.Services.SeedIdentidadAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
