# --- ETAPA 1: COMPILACIÓN ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiamos primero los archivos de solución y proyectos para aprovechar la caché de NuGet
COPY ["CardiologiaHGSM/CardiologiaHGSM.slnx", "CardiologiaHGSM/"]
COPY ["CardiologiaHGSM/src/CardiologiaHGSM.Domain/CardiologiaHGSM.Domain.csproj", "CardiologiaHGSM/src/CardiologiaHGSM.Domain/"]
COPY ["CardiologiaHGSM/src/CardiologiaHGSM.Application/CardiologiaHGSM.Application.csproj", "CardiologiaHGSM/src/CardiologiaHGSM.Application/"]
COPY ["CardiologiaHGSM/src/CardiologiaHGSM.Infrastructure/CardiologiaHGSM.Infrastructure.csproj", "CardiologiaHGSM/src/CardiologiaHGSM.Infrastructure/"]
COPY ["CardiologiaHGSM/src/CardiologiaHGSM.WebApi/CardiologiaHGSM.WebApi.csproj", "CardiologiaHGSM/src/CardiologiaHGSM.WebApi/"]

RUN dotnet restore "CardiologiaHGSM/src/CardiologiaHGSM.WebApi/CardiologiaHGSM.WebApi.csproj"

# Copiamos el resto del código fuente y publicamos en modo Release
COPY . .
RUN dotnet publish "CardiologiaHGSM/src/CardiologiaHGSM.WebApi/CardiologiaHGSM.WebApi.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# --- ETAPA 2: PRODUCCIÓN ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS prod
WORKDIR /app

ENV TZ=America/Argentina/Buenos_Aires
EXPOSE 5000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CardiologiaHGSM.WebApi.dll"]
