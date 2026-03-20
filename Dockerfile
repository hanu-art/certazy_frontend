# ─────────────────────────────────────────────
# Stage 1 — BUILD
# Install dependencies and build the React/Vite app
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
# This way dependency layer stays cached
# even when source code changes
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build for production — output goes to /app/dist
RUN npm run build


# ─────────────────────────────────────────────
# Stage 2 — SERVE
# Only the dist folder is needed here
# Serve via Nginx — no Node required
# Final image size is ~25MB
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove Nginx default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy only the build output from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]