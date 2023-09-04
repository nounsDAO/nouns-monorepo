# @nouns/contracts

## Background

Nouns are an experimental attempt to improve the formation of on-chain avatar communities. While projects such as CryptoPunks have attempted to bootstrap digital community and identity, Nouns attempt to bootstrap identity, community, governance and a treasury that can be used by the community for the creation of long-term value.

One Noun is generated and auctioned every day, forever. All Noun artwork is stored and rendered on-chain. See more information at [nouns.wtf](https://nouns.wtf/).

## Contracts

| Contract                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Address                                                                                                               |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [NounsToken](./contracts/NounsToken.sol)                                  | This is the Nouns ERC721 Token contract. Unlike other Nouns contracts, it cannot be replaced or upgraded. Beyond the responsibilities of a standard ERC721 token, it is used to lock and replace periphery contracts, store checkpointing data required by our Governance contracts, and control Noun minting/burning. This contract contains two main roles - `minter` and `owner`. The `minter` will be set to the Nouns Auction House in the constructor and ownership will be transferred to the Nouns DAO following deployment.                                                                                                    | [0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03) |
| [NounsSeeder](./contracts/NounsSeeder.sol)                                | This contract is used to determine Noun traits during the minting process. It can be replaced to allow for future trait generation algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any future updates. Currently, Noun traits are determined using pseudo-random number generation: `keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))`. Trait generation is not truly random. Traits can be predicted when minting a Noun on the pending block.                                                                                                                                          | [0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515](https://etherscan.io/address/0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515) |
| [NounsDescriptor](./contracts/NounsDescriptor.sol)                        | This contract is used to store/render Noun artwork and build token URIs. Noun 'parts' are compressed in the following format before being stored in their respective byte arrays: `Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][]`. When `tokenURI` is called, Noun parts are read from storage and converted into a series of SVG rects to build an SVG image on-chain. Once the entire SVG has been generated, it is base64 encoded. The token URI consists of base64 encoded data URI with the JSON contents directly inlined, including the SVG image. | [0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63](https://etherscan.io/address/0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63) |
| [NounsAuctionHouse](./contracts/NounsAuctionHouse.sol)                    | This contract acts as a self-sufficient noun generation and distribution mechanism, auctioning one noun every 24 hours, forever. 100% of auction proceeds (ETH) are automatically deposited in the Nouns DAO treasury, where they are governed by noun owners. Each time an auction is settled, the settlement transaction will also cause a new noun to be minted and a new 24 hour auction to begin. While settlement is most heavily incentivized for the winning bidder, it can be triggered by anyone, allowing the system to trustlessly auction nouns as long as Ethereum is operational and there are interested bidders.       | [0xF15a943787014461d94da08aD4040f79Cd7c124e](https://etherscan.io/address/0xF15a943787014461d94da08aD4040f79Cd7c124e) |
| [NounsDAOExecutor](./contracts/governance/NounsDAOExecutor.sol)           | This contract is a fork of Compound's `Timelock`. It acts as a timelocked treasury for the Nouns DAO. This contract is controlled by the governance contract (`NounsDAOProxy`).                                                                                                                                                                                                                                                                                                                                                                                                                                                         | [0x0BC3807Ec262cB779b38D65b38158acC3bfedE10](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10) |
| [NounsDAOProxy](./contracts/governance/NounsDAOProxy.sol)                 | This contract is a fork of Compound's `GovernorBravoDelegator`. It can be used to create, vote on, and execute governance proposals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [0x6f3E6272A167e8AcCb32072d08E0957F9c79223d](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d) |
| [NounsDAOExecutorProxy](./contracts/governance/NounsDAOExecutorProxy.sol) | This contract is an ERC1967Proxy for the second version of the DAO's timelock. It's used as a proxy to enable upgrades.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71) |
| [NounsDAOExecutorV2](./contracts/governance/NounsDAOExecutorV2.sol)       | This contract is an upgrade to `NounsDAOExecutor`, adding support for DAO fork. It's the first implementation logic for `NounsDAOExecutorProxy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | [0x0FB7CF84F171154cBC3F553aA9Df9b0e9076649D](https://etherscan.io/address/0x0FB7CF84F171154cBC3F553aA9Df9b0e9076649D) |
| [NounsDAOLogicV3](./contracts/governance/NounsDAOLogicV3.sol)             | This is an upgrade to `NounsDAOLogicV2`, adding DAO fork, proposeBySigs, updatable period & objection period.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | [0xdD1492570beb290a2f309541e1fDdcaAA3f00B61](https://etherscan.io/address/0xdD1492570beb290a2f309541e1fDdcaAA3f00B61) |
| [NounsDAOLogicV2](./contracts/governance/NounsDAOLogicV2.sol)             | This is an upgrade to `NounsDAOLogicV1`, adding dynamic quorum and gas refunds for voting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [0x51C7D7C47E440d937208bD987140D6db6B1E4051](https://etherscan.io/address/0x51C7D7C47E440d937208bD987140D6db6B1E4051) |
| [NounsDAOLogicV1](./contracts/governance/NounsDAOLogicV1.sol)             | This contract is a fork of Compound's `GovernorBravoDelegate`. It was the first logic contract used by the `NounsDAOProxy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | [0xa43aFE317985726E4e194eb061Af77fbCb43F944](https://etherscan.io/address/0xa43aFE317985726E4e194eb061Af77fbCb43F944) |
| [ForkDAODeployer](./contracts/governance/fork/ForkDAODeployer.sol)        | This contract is used to deploy forked DAO as part of the DAO fork feature.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | [0xcD65e61f70e0b1Aa433ca1d9A6FC2332e9e73cE3](https://etherscan.io/address/0xcd65e61f70e0b1aa433ca1d9a6fc2332e9e73ce3) |
| [NounsDAOForkEscrow](./contracts/governance/fork/NounsDAOForkEscrow.sol)  | This contract is used to escrow Nouns intended to be sent to the DAO for forking.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [0x44d97D22B3d37d837cE4b22773aAd9d1566055D9](https://etherscan.io/address/0x44d97D22B3d37d837cE4b22773aAd9d1566055D9) |
| [NounsDAODataProxy](./contracts/governance/data/NounsDAODataProxy.sol)    | This contract is an ERC1967Proxy for NounsDAOData to enable upgrades.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [0xf790A5f59678dd733fb3De93493A91f472ca1365](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365) |
| [NounsDAOData](./contracts/governance/data/NounsDAOData.sol)              | This contract is used to publish events related to proposals, e.g. new proposal candidates. It is meant mostly as data availability.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [0x26d6cD86c1F30aD528c67300bD7ACf48F23F9EB6](https://etherscan.io/address/0x26d6cd86c1f30ad528c67300bd7acf48f23f9eb6) |

## Development

### Install dependencies

```sh
yarn
```

### Compile typescript, contracts, and generate typechain wrappers

```sh
yarn build
```

### Run tests

```sh
yarn test
```

### Install forge dependencies

```sh
forge install
```

### Run forge tests

```sh
forge test -vvv
```

### Environment Setup

Copy `.env.example` to `.env` and fill in fields

### Commands

```sh
# Compile Solidity
yarn build:sol

# Command Help
yarn task:[task-name] --help

# Deploy & Configure for Local Development (Hardhat)
yarn task:run-local

# Deploy & Configure (Testnet/Mainnet)
# This task deploys and verifies the contracts, populates the descriptor, and transfers contract ownership.
# For parameter and flag information, run `yarn task:deploy-and-configure --help`.
yarn task:deploy-and-configure --network [network] --update-configs
```

### Automated Testnet Deployments

The contracts are deployed to Rinkeby on each push to master and each PR using the account `0x387d301d92AE0a87fD450975e8Aef66b72fBD718`. This account's mnemonic is stored in GitHub Actions as a secret and is injected as the environment variable `MNEMONIC`. This mnemonic _shouldn't be considered safe for mainnet use_.
