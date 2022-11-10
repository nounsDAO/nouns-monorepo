# nounsbr-monorepo

NounsBR DAO is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to NounsBR DAO repos we're excited to have you. Please discuss any changes in `#developers` in [discord.gg/nounsbr](https://discord.gg/nounsbr) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### nounsbr-api

The [nounsbr api](packages/nounsbr-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### nounsbr-assets

The [nounsbr assets](packages/nounsbr-assets) package holds the NounBR PNG and run-length encoded image data.

### nounsbr-bots

The [nounsbr bots](packages/nounsbr-bots) package contains a bot that monitors for changes in NounBR auction state and notifies everyone via Twitter and Discord.

### nounsbr-contracts

The [nounsbr contracts](packages/nounsbr-contracts) is the suite of Solidity contracts powering NounsBR DAO.

### nounsbr-sdk

The [nounsbr sdk](packages/nounsbr-sdk) exposes the NounsBR contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### nounsbr-subgraph

In order to make retrieving more complex data from the auction history, [nounsbr subgraph](packages/nounsbr-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### nounsbr-webapp

The [nounsbr webapp](packages/nounsbr-webapp) is the frontend for interacting with NounBR auctions as hosted at [nounsbr.wtf](https://nounsbr.wtf).

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
