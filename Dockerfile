FROM --platform=linux/amd64 node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

FROM --platform=linux/amd64 base AS development
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "run", "dev"]

FROM --platform=linux/amd64 base AS builder
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM --platform=linux/amd64 node:20-alpine AS production
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./
RUN npx prisma generate
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/generated ./generated
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]