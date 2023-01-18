# @n00uns/contracts

## Background

N00uns are an experimental attempt to improve the formation of on-chain avatar communities. While projects such as CryptoPunks have attempted to bootstrap digital community and identity, N00uns attempt to bootstrap identity, community, governance and a treasury that can be used by the community for the creation of long-term value.

One N00un is generated and auctioned every day, forever. All N00un artwork is stored and rendered on-chain. See more information at [n00uns.wtf](https://n00uns.wtf/).

## Contracts

| Contract                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Address                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [N00unsToken](./contracts/N00unsToken.sol)                        | This is the N00uns ERC721 Token contract. Unlike other N00uns contracts, it cannot be replaced or upgraded. Beyond the responsibilities of a standard ERC721 token, it is used to lock and replace periphery contracts, store checkpointing data required by our Governance contracts, and control N00un minting/burning. This contract contains two main roles - `minter` and `owner`. The `minter` will be set to the N00uns Auction House in the constructor and ownership will be transferred to the N00uns DAO following deployment.                                                                                                  | [0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03) |
| [N00unsSeeder](./contracts/N00unsSeeder.sol)                      | This contract is used to determine N00un traits during the minting process. It can be replaced to allow for future trait generation algorithm upgrades. Additionally, it can be locked by the N00uns DAO to prevent any future updates. Currently, N00un traits are determined using pseudo-random number generation: `keccak256(abi.encodePacked(blockhash(block.number - 1), n00unId))`. Trait generation is not truly random. Traits can be predicted when minting a N00un on the pending block.                                                                                                                                        | [0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515](https://etherscan.io/address/0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515) |
| [N00unsDescriptor](./contracts/N00unsDescriptor.sol)              | This contract is used to store/render N00un artwork and build token URIs. N00un 'parts' are compressed in the following format before being stored in their respective byte arrays: `Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][]`. When `tokenURI` is called, N00un parts are read from storage and converted into a series of SVG rects to build an SVG image on-chain. Once the entire SVG has been generated, it is base64 encoded. The token URI consists of base64 encoded data URI with the JSON contents directly inlined, including the SVG image. | [0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63](https://etherscan.io/address/0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63) |
| [N00unsAuctionHouse](./contracts/N00unsAuctionHouse.sol)          | This contract acts as a self-sufficient n00un generation and distribution mechanism, auctioning one n00un every 24 hours, forever. 100% of auction proceeds (ETH) are automatically deposited in the N00uns DAO treasury, where they are governed by n00un owners. Each time an auction is settled, the settlement transaction will also cause a new n00un to be minted and a new 24 hour auction to begin. While settlement is most heavily incentivized for the winning bidder, it can be triggered by anyone, allowing the system to trustlessly auction n00uns as long as Ethereum is operational and there are interested bidders.    | [0xF15a943787014461d94da08aD4040f79Cd7c124e](https://etherscan.io/address/0xF15a943787014461d94da08aD4040f79Cd7c124e) |
| [N00unsDAOExecutor](./contracts/governance/N00unsDAOExecutor.sol) | This contract is a fork of Compound's `Timelock`. It acts as a timelocked treasury for the N00uns DAO. This contract is controlled by the governance contract (`N00unsDAOProxy`).                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [0x0BC3807Ec262cB779b38D65b38158acC3bfedE10](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10) |
| [N00unsDAOProxy](./contracts/governance/N00unsDAOProxy.sol)       | This contract is a fork of Compound's `GovernorBravoDelegator`. It can be used to create, vote on, and execute governance proposals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [0x6f3E6272A167e8AcCb32072d08E0957F9c79223d](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d) |
| [N00unsDAOLogicV1](./contracts/governance/N00unsDAOLogicV1.sol)   | This contract is a fork of Compound's `GovernorBravoDelegate`. It's the logic contract used by the `N00unsDAOProxy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [0xa43aFE317985726E4e194eb061Af77fbCb43F944](https://etherscan.io/address/0xa43aFE317985726E4e194eb061Af77fbCb43F944) |

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
