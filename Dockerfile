FROM node:18

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

# RUN npm run build

CMD yarn dev