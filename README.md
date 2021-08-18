# nouns-monorepo

NounsDAO is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to NounsDAO repos we're excited to have you. Please discuss any changes in `#developers` in [discord.gg/nouns](https://discord.gg/nouns) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### nouns-api

The [nouns api](packages/nouns-api) is an HTTP webserver.

### nouns-contracts

The [nouns contracts](packages/nouns-contracts) is the suite of Solidity contracts powering NounsDAO.

### nouns-webapp

The [nouns-webapp](packages/nouns-webapp) is the frontend for interacting with Noun auctions as hosted at [nouns.wtf](https://nouns.wtf).

### nouns-bots

The [nouns-bots](packages/nouns-bots) package contains a bot that monitors for changes in Noun auction state and notifies everyone via Twitter and Discord.

### nouns-subgraph

In order to make retrieving more complex data from the auction history, [nouns-subgraph](packages/nouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

## Quickstart

### Install dependencies

```sh
yarn
```

### Build all packages

```sh
yarn build
```

### Run Linter

```sh
yarn lint
```

### Run Prettier

```sh
yarn format
```
