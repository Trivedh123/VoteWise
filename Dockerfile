# Stage 1: Build the Frontend
FROM node:18-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Backend & Final Image
FROM node:18-slim
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source code
COPY backend ./backend

# Copy the frontend build from Stage 1 into the backend/dist folder
COPY --from=frontend-builder /app/dist ./backend/dist

# Set working directory to backend to run the server
WORKDIR /app/backend

# Run the server
EXPOSE 8080
CMD ["node", "server.js"]
