# Usa una imagen base de Node.js
FROM node:23

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Crea la carpeta dist si no existe
RUN mkdir -p dist

# Verifica si nodemon está instalado
RUN ./node_modules/.bin/nodemon -v

# Expone el puerto que usará Parcel
EXPOSE 1234

# Comando para iniciar Parcel
CMD ["npm", "run", "dev"]
