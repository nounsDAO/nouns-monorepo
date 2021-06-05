# nouns-contracts

## Build

```sh
yarn
```

## Compile contracts and generate typechain wrappers

```sh
yarn build
```

## Run tests

```sh
yarn test
```

### Deploying

## Environment Setup

- Copy `.env.example` to `.env` and fill in fields

## Commands

```
# compiling
npx hardhat compile

# deploying
npx hardhat run --network rinkeby scripts/deploy.js

# verifying on etherscan
npx hardhat verify --network rinkeby {DEPLOYED_ADDRESS}

# replace `rinkeby` with `mainnet` to productionize
```
