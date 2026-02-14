# Use a lightweight Node image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the TypeScript code to /dist
RUN npm run build

# Tell Docker which port your app runs on
EXPOSE 5000

# Start the compiled JS code
CMD ["node", "dist/index.js"]

