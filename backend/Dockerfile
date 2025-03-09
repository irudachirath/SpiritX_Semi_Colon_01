# Use official Node.js image
FROM node:18-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy built backend files
COPY ./dist /app/dist
COPY package.json package-lock.json /app/

# Install production dependencies
RUN npm ci --only=production

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["node", "dist/app.js"]
