# n00uns-monorepo

N00uns DAO is a generative avatar art collective run by a group of crypto misfits.

## Packages

### n00uns-api

The [n00uns api](packages/n00uns-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### n00uns-assets

The [n00uns assets](packages/n00uns-assets) package holds the N00un PNG and run-length encoded image data.

### n00uns-bots

The [n00uns bots](packages/n00uns-bots) package contains a bot that monitors for changes in N00un auction state and notifies everyone via Twitter and Discord.

### n00uns-contracts

The [n00uns contracts](packages/n00uns-contracts) is the suite of Solidity contracts powering N00uns DAO.

### n00uns-sdk

The [n00uns sdk](packages/n00uns-sdk) exposes the N00uns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### n00uns-subgraph

In order to make retrieving more complex data from the auction history, [n00uns subgraph](packages/n00uns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### n00uns-webapp

The [n00uns webapp](packages/n00uns-webapp) is the frontend for interacting with N00un auctions as hosted at [n00uns.wtf](https://n00uns.wtf).

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
