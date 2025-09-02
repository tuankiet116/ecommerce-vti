# Stage 1: Build app
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Stage 2: Run app with minimal image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env ./

# Set environment variables (if needed)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
