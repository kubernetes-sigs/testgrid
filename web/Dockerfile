# Multi-stage build with pnpm
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

FROM base AS build
# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copy source code
COPY . .

ARG API_URL
ENV API_URL=$API_URL

# Build the application
RUN pnpm run build

# Production stage with nginx
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built static files from build stage
COPY --from=build /app/dist .

# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
