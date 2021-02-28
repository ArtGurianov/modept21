FROM node:12.13-alpine as development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
COPY start.sh /
RUN chmod +x /start.sh


FROM development as build
ENV NODE_ENV=development
RUN yarn build


FROM node:12.13-alpine as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
COPY --from=build /usr/src/app/dist ./dist
COPY start.sh /
RUN chmod +x /start.sh
CMD ["/start.sh"]