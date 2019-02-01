FROM node:10-alpine

ADD ./ /api

WORKDIR /api

RUN yarn

EXPOSE "3000"

CMD node index.js