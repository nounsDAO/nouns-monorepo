# nouns-monorepo

Nouns DAO is a generative avatar art collective run by a group of crypto misfits.

## Packages

### nouns-assets

The [nouns assets](packages/nouns-assets) package holds the Noun PNG and run-length encoded image data.

### nouns-contracts

The [nouns contracts](packages/nouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### nouns-sdk

The [nouns sdk](packages/nouns-sdk) includes methods and react hooks for interacting with all the Nouns contracts, as well as image encoding and SVG building utilities.

### nouns-api

A [ponder.sh](https://github.com/ponder-sh/ponder) based API for all historical NounsDAO data

### nouns-subgraph

**deprecated** in favor of **nouns-api**

In order to make retrieving more complex data from the auction history, [nouns subgraph](packages/nouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### nouns-webapp

The [nouns webapp](packages/nouns-webapp) is the frontend for interacting with Noun auctions as hosted at [nouns.wtf](https://nouns.wtf).

## Quickstart

### Install dependencies

```sh
pnpm install
```

### Build all packages

```sh
pnpm build
```

### Run Linter

```sh
pnpm lint
```

### Run Prettier

```sh
pnpm format
```
