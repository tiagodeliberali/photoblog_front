FROM nginx AS base
EXPOSE 80

FROM node:8.11.2 AS build
RUN mkdir -p /app
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /app/
RUN npm install && npm cache clean --force
COPY . /app/
RUN npm install -g gulp
RUN npm install -g bower
RUN gulp dist

FROM base AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
