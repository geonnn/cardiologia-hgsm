using System.Text.Json.Serialization;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Infrastructure.Common;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

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

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
