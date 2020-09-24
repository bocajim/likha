FROM node:lts-alpine AS assets

WORKDIR /app

COPY * ./

RUN npm install

COPY public /app/public
COPY src /app/src/

RUN npm run build

FROM nginx:1.17.7-alpine

COPY --from=assets /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
