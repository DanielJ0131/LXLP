#Base image for node version 22
FROM node:22

# Goes to the app directory (like cd in terminal commands)
WORKDIR /app

# Copy package.json dependencies and package-lock.json if available
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app into the container
COPY . .

# Set port environemnt variable
ENV PORT=3000

# Expose the port so our computer can access it
EXPOSE 9000

# Run the app
CMD ["npm", "start"]