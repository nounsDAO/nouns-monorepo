FROM node:14

WORKDIR /app

ADD lerna.json .
ADD package.json .
ADD yarn.lock .

# Build cache layer
RUN yarn --ignore-scripts

ADD . .

# Install any package specific dependencies
RUN yarn

WORKDIR /app/packages/nouns-bots

RUN yarn build

CMD [ "node",  "/app/packages/nouns-bots/dist/index.js"]
