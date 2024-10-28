# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Set environment variables (can be overridden when running the container)
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]
