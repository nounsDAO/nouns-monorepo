# vrbs-monorepo

N00uns DAO is a generative avatar art collective run by a group of crypto misfits.

## Packages

### vrbs-api

The [vrbs api](packages/vrbs-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### vrbs-assets

The [vrbs assets](packages/vrbs-assets) package holds the N00un PNG and run-length encoded image data.

### vrbs-bots

The [vrbs bots](packages/vrbs-bots) package contains a bot that monitors for changes in N00un auction state and notifies everyone via Twitter and Discord.

### vrbs-contracts

The [vrbs contracts](packages/vrbs-contracts) is the suite of Solidity contracts powering N00uns DAO.

### vrbs-sdk

The [vrbs sdk](packages/vrbs-sdk) exposes the N00uns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### vrbs-subgraph

In order to make retrieving more complex data from the auction history, [vrbs subgraph](packages/vrbs-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### vrbs-webapp

The [vrbs webapp](packages/vrbs-webapp) is the frontend for interacting with N00un auctions as hosted at [vrbs.wtf](https://vrbs.wtf).

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
