# ----------- STAGE 1: Build do Angular -----------
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production

# ----------- STAGE 2: NGINX para servir o front -----------
FROM nginx:stable-alpine

# Copia o build gerado pelo Angular 19 (dist/base-front/browser)
COPY --from=build /app/dist/base-front/browser /usr/share/nginx/html

# Copia configuração do NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
