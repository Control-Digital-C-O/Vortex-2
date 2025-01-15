# Utilizar una imagen base con Node.js
FROM node:23

# Crear y configurar el directorio de la aplicación
WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
# COPY . .

# Exponer el puerto
# EXPOSE 1234

# Ejecutar la aplicación
CMD ["npm", "run", "dev"]
