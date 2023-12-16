FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install -g yarn

RUN yarn install

COPY . .

RUN yarn build

CMD yarn start