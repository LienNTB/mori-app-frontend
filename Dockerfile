FROM node:18

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# RUN npm install -g yarn --force

RUN yarn install

COPY . .

RUN yarn build

CMD yarn dev