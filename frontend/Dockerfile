# --- ETAPA 1: COMPILACIÓN ---
FROM node:26-alpine AS build
WORKDIR /app

# Copiamos package.json y package-lock.json para cachear dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el código fuente y generamos el bundle estático en /app/dist
COPY . .
RUN npm run build

# --- ETAPA 2: PRODUCCIÓN ---
FROM nginx:alpine AS prod

# Reemplazamos la configuración por defecto de Nginx con nuestro reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados desde la etapa "build"
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
