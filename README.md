# punks-monorepo

DAO Punks is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to DAO Punks repos we're excited to have you. Please discuss any changes in `#developers` in [https://discord.gg/keNWmpdQD7](https://discord.gg/keNWmpdQD7) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### punks-api

The [punks api](packages/punks-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### punks-assets

The [punks assets](packages/punks-assets) package holds the DAO Punks PNG and run-length encoded image data.

### punks-bots

The [punks bots](packages/punks-bots) package contains a bot that monitors for changes in DAO Punks auction state and notifies everyone via Twitter and Discord.

### punks-contracts

The [punks contracts](packages/punks-contracts) is the suite of Solidity contracts powering Punkers DAO.

### punks-sdk

The [punks sdk](packages/punks-sdk) exposes the DAO Punks contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### punks-subgraph

In order to make retrieving more complex data from the auction history, [punks subgraph](packages/punks-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### punks-webapp

The [punks webapp](packages/punks-webapp) is the frontend for interacting with DAO Punks auctions as hosted at [punks.auction](https://punks.auction).

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
