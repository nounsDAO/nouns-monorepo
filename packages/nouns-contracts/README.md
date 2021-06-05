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

## Automated Testnet Deployments

The contracts are deployed to Rinkeby on each push to master and each PR using the account `0x387d301d92AE0a87fD450975e8Aef66b72fBD718`. This account's mnemonic is stored in GitHub Actions as a secret and is injected as the environment variable `MNEMONIC`. This mnemonic _shouldn't be considered safe for mainnet use_.
