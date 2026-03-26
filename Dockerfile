# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack (yarn)
RUN corepack enable

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build app
RUN yarn build


# ===== Stage 2: Production =====
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

# Copy only necessary files
COPY package.json yarn.lock ./

# Install only production deps
RUN yarn install --production --frozen-lockfile

# Copy build output from builder
COPY --from=builder /app/dist ./dist

# Copy templates
COPY --from=builder /app/src/modules/mails/templates ./dist/modules/mails/templates

EXPOSE 3305

# Run app
CMD ["node", "dist/main.js"]