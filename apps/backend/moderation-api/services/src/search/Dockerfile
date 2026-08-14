FROM node:24-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npx prisma generate

EXPOSE 3003
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
