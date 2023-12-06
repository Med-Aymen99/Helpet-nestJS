FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

RUN npm run build

CMD [ "node", "dist/main.js" ]

