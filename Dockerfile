FROM docker.io/node:lts-alpine as build
ARG API_URL
WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY . ./
RUN NG_APP_API_URL=${API_URL} npm run build

FROM docker.io/node:lts-alpine
WORKDIR /usr/app
COPY --from=build /app/src/dist/simplenotes ./
CMD node server/server.mjs
EXPOSE 4000
