using System.Text.Json.Serialization;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Infrastructure.Common;
using CardiologiaHGSM.Infrastructure.Identity;
using CardiologiaHGSM.WebApi.Common;
using CardiologiaHGSM.WebApi.Cli;
using CardiologiaHGSM.WebApi.Health;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(CliCommands.StripFromArgs(args));

// Add services to the container.

// MVC JsonOptions (runtime de Controllers) y Http JsonOptions (esquema OpenAPI / Scalar)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        ));

builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    ));

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddAutenticacion();
builder.Services.AddCorsConfigurable(builder.Configuration);
builder.Services.AddApiHealthChecks();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// roles del sistema + administrador inicial (Seed:Admin)
await app.Services.SeedIdentidadAsync();
if (await app.TryRunCliCommandsAsync(args))
    return;

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi().AllowAnonymous();
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapApiHealthChecks();
app.MapControllers();

app.Run();
