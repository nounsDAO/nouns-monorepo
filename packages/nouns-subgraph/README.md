# @nouns/subgraph

A subgraph that indexes nouns events.

## Quickstart

```sh
yarn
```

## Nouns subgraph

This repo contains the templates for compiling and deploying a graphql schema to thegraph.

### Authenticate

To authenticate for thegraph deployment use the `Access Token` from thegraph dashboard:

```sh
yarn run graph auth https://api.thegraph.com/deploy/ $ACCESS_TOKEN
```

### Create subgraph.yaml from config template

```sh
yarn prepare:[network] # Supports rinkeby and mainnet
```

### Generate types to use with Typescript

```sh
yarn codegen
```

### Compile and deploy to thegraph (must be authenticated)

```sh
yarn deploy:[network] # Supports rinkeby and mainnet
```
