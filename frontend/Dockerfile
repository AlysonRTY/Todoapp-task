# Development Dockerfile for Frontend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Expose Vite's default port
EXPOSE 5173

# The source code will be mounted as a volume
# Command will be specified in docker-compose.yml
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]