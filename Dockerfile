# ── Mobile Frame UI ──────────────────────────────────────────────
#
# This Dockerfile runs the application using Node directly (Vite dev server).
# Useful for development or testing.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine

WORKDIR /app

# Copy manifests first (layer caching)
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install

# Copy entire source
COPY . .

# Expose Vite's default port (5173)
EXPOSE 5173

# Start the dev server with --host to allow external connections
CMD ["yarn", "dev", "--host"]
