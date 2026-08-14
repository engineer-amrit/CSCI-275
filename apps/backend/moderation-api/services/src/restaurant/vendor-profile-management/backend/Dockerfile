FROM node:24-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npx prisma generate

EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node prisma/seed.js && node server.js"]
