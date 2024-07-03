# Dockerfile cho Frontend
FROM node:18 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Sử dụng nginx để phục vụ tệp tĩnh
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
