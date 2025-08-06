# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Stream actions (`@nouns/sdk/stream`) and react hooks (`@nouns/sdk/react/stream`) to be paired up with the `stream-factory` ones

## [1.0.0] - 2022-07-24

### Added

- modules with Wagmi cli generated actions and React hooks for current contracts:
  - actions:
    - `@nouns/sdk/governor`
    - `@nouns/sdk/legacy-treasury`
    - `@nouns/sdk/treasury`
    - `@nouns/sdk/data`
    - `@nouns/sdk/token`
    - `@nouns/sdk/auction-house`
    - `@nouns/sdk/descriptor`
    - `@nouns/sdk/stream-factory`
    - `@nouns/sdk/usdc-payer`
    - `@nouns/sdk/usdc-token-buyer`
  - react hooks:
    - `@nouns/sdk/react/governor`
    - `@nouns/sdk/react/legacy-treasury`
    - `@nouns/sdk/react/treasury`
    - `@nouns/sdk/react/data`
    - `@nouns/sdk/react/token`
    - `@nouns/sdk/react/auction-house`
    - `@nouns/sdk/react/descriptor`
    - `@nouns/sdk/react/stream-factory`
    - `@nouns/sdk/react/usdc-payer`
    - `@nouns/sdk/react/usdc-token-buyer`

### Changed

- **BREAKING**: Increased minimum node version requirement to 16+

### Removed

- **BREAKING**: Ethers.js dependency and old contract definitions and legacy exports from root module `@nouns/sdk`
  - types: `ChainId`, `ContractAddresses`
  - methods: `getContractsForChainOrThrow`, `getContractAddressesForChainOrThrow`
  - abis: `NounsTokenABI`, `NounsAuctionHouseABI`, `NounsDescriptorABI`, `NounsSeederABI`, `NounsDAOABI`, `NounsDAOV2ABI`,
  - factories: `NounsTokenFactory`, `NounsAuctionHouseFactory`, `NounsDescriptorFactory`, `NounsSeederFactory`, `NounsDaoLogicV1Factory`, `NounsDaoLogicV2Factory`

## [0.4.0] - 2022-11-22

### Added

- Started maintaining a changelog from this version onward.

[Unreleased]: https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-sdk
[1.0.0]: https://github.com/nounsDAO/nouns-monorepo/tree/6e0b43054/packages/nouns-sdk
[0.4.0]: https://github.com/nounsDAO/nouns-monorepo/tree/6e75b03a5/packages/nouns-sdk
