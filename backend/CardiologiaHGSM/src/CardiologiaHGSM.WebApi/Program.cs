using System.Text.Json.Serialization;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Infrastructure.Common;
using CardiologiaHGSM.WebApi.Cli;
using CardiologiaHGSM.WebApi.Health;
using CardiologiaHGSM.WebApi.Middleware;
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
{
    
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter());
        
    options.SerializerOptions.NumberHandling = 
        JsonNumberHandling.Strict;
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddApiHealthChecks();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ConcurrencyExceptionHandler>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

if (await app.TryRunCliCommandsAsync(args))
    return;

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapApiHealthChecks();
app.MapControllers();

app.Run();
