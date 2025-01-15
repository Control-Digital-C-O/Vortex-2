# Use the official Node.js image from the Docker Hub
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for the React app
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]