# Etapa de construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./
# Instalamos dependencias
RUN npm install

# Copiamos el código fuente
COPY . .
# Compilamos la aplicación para producción
RUN npm run build

# Etapa de ejecución (Run) usando Nginx
FROM nginx:alpine
# Copiamos la build generada a la carpeta pública de nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración básica de nginx para aplicaciones de una sola página (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto por defecto de nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
