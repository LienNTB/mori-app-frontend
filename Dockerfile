FROM node:18

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

# RUN npm run build
RUN yarn build

CMD yarn start