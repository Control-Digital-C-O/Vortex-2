# Usa una imagen base de Node.js
FROM node:23

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Asegúrate de que la carpeta de salida exista
RUN mkdir -p dist

# Expone el puerto que usará Parcel (puedes cambiar este puerto si es necesario)
EXPOSE 1234

# Comando para iniciar el servidor con hot reload
CMD ["npm", "run", "dev"]
