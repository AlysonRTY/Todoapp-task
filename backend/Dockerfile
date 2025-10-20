# Development Dockerfile for Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Ensure prisma directory exists and has proper permissions
RUN mkdir -p /app/prisma && chmod -R 777 /app/prisma

# Expose the port
EXPOSE 8000

# Create startup script that uses our docker:setup npm script
RUN echo '#!/bin/sh\n\
    set -e\n\
    echo "=== Setting up database ==="\n\
    npm run docker:setup\n\
    echo "=== Database setup complete ==="\n\
    echo "=== Starting dev server ==="\n\
    exec npm run dev\n\
    ' > /app/start.sh && chmod +x /app/start.sh

# The source code will be mounted as a volume
CMD ["/app/start.sh"]