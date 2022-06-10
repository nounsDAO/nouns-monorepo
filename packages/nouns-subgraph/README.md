# @nouns/subgraph

A subgraph that indexes nouns events.

## Quickstart

```sh
yarn
```

## Nouns Subgraph

This repo contains the templates for compiling and deploying a graphql schema to thegraph.

### Authenticate

To authenticate for thegraph deployment use the `Access Token` from thegraph dashboard:

```sh
yarn run graph auth https://api.thegraph.com/deploy/ $ACCESS_TOKEN
```

### Create subgraph.yaml from config template

```sh
# Official Subgraph
yarn prepare:[network] # Supports rinkeby and mainnet

# Fork
yarn --silent mustache config/[network]-fork.json subgraph.yaml.mustache > subgraph.yaml
```

### Generate types to use with Typescript

```sh
yarn codegen
```

### Compile and deploy to thegraph (must be authenticated)

```sh
# Official Subgraph
yarn deploy:[network] # Supports rinkeby and mainnet

# Fork
yarn deploy [organization]/[subgraph-name]
```

## Running a local deployment

Make sure you have Docker installed.
Run your local graph node by running:

```sh
yarn graph-node
```

Make sure your local chain is running: in a new terminal go to the `nouns-contracts` package and run:

```sh
yarn task:run-local
```

Then in a new terminal run:

```sh
yarn deploy:hardhat
```

## Running tests

### Matchstick setup

We're using [Matchstick](https://github.com/LimeChain/matchstick). Matchstick supports Macs and other Ubuntu-based machines natively. For other operating systems they have a Docker-based solution (see their repo for more info).

Copy `matchstick.yaml.example` and name the copy `matchstick.yaml`. Make sure the path there is a \*_full_ working path to your monorepo's top `node_modules` folder. Matchstick compilation fails when using relative paths.

### Running tests

From a clean pull run these commands in sequence:

```sh
yarn prepare:rinkeby && yarn codegen

yarn test
```
