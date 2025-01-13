# Stage 1: Build the application
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run the application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
