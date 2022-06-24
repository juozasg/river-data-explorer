FROM node:18-alpine AS build

ENV WORKDIR=/app
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

ADD package.json yarn.lock ./
ADD src/theme/ ./src/theme/

RUN mkdir -p public/build
RUN yarn install

ADD . .
RUN yarn build

FROM nginx AS deploy

# You cannot use environment variables here :\
COPY --from=build /app/public/ /usr/share/nginx/html/
