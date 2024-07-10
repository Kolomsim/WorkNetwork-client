FROM node:21-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm install socket.io-client
EXPOSE 3000
CMD ["npm", "run", "dev"]