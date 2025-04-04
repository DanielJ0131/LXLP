# Use the official Node.js image from the Docker Hub
FROM node:latest

# Goes to the app directory (like cd in terminal commands)
WORKDIR /app

# Copy package.json dependencies and package-lock.json if available
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app into the container
COPY . .

# Change to an ordinary user
USER node

# Run the app
CMD ["npm", "start"]