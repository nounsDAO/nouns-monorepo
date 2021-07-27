# @nouns/contracts

## Background
---

Nouns are an experimental attempt to improve the formation of on-chain avatar communities. While projects such as Cryptopunks have attempted to bootstrap digital community and identity, Nouns attempt to bootstrap identity, community, governance and a treasury that can be used by the community for the creation of long-term value.

One Noun is generated and auctioned every day, forever. All Noun artwork is stored and rendered on-chain. See more information at [nouns.wtf](https://nouns.wtf/).

## Contracts
---

| Contract | Description |
| --- | --- |
| [NounsToken](./contracts/NounsToken.sol) | This is the Nouns ERC721 Token contract. Unlike other Nouns contracts, it cannot be replaced or upgraded. Beyond the responsibilities of a standard ERC721 token, it is used to lock and replace periphery contracts, store checkpointing data required by our Governance contracts, and control Noun minting/burning. This contract contains two main roles - `minter` and `owner`. The `minter` will be set to the Nouns Auction House in the constructor and ownership will be transferred to the Nouns DAO following deployment. |
| [NounsSeeder](./contracts/NounsSeeder.sol) | This contract is used to determine Noun traits during the minting process. It can be replaced to allow for future trait generation algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any future updates. Currently, Noun traits are determined using pseudo-random number generation: `keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))`. Trait generation is not truly random. Traits can be predicted when minting a Noun on the pending block. |
| [NounsDescriptor](./contracts/NounsDescriptor.sol) | This contract is used to store/render Noun artwork and build token URIs. Noun 'parts' are compressed in the following format before being stored in their respective byte arrays: `Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][]`. When `tokenURI` is called, Noun parts are read from storage and converted into a series of SVG rects to build an SVG image on-chain. Once the entire SVG has been generated, it is base64 encoded. The token URI consists of base64 encoded data URI with the JSON contents directly inlined, including the SVG image. |
| [NounsAuctionHouse](./contracts/NounsAuctionHouse.sol) | This contract acts as a self-sufficient noun generation and distribution mechanism, auctioning one noun every 24 hours, forever. 100% of auction proceeds (ETH) are automatically deposited in the Nouns DAO treasury, where they are governed by noun owners. Each time an auction is settled, the settlement transaction will also cause a new noun to be minted and a new 24 hour auction to begin. While settlement is most heavily incentivized for the winning bidder, it can be triggered by anyone, allowing the system to trustlessly auction nouns as long as Ethereum is operational and there are interested bidders. |
| [NounsDAOExecutor](./contracts/governance/NounsDAOExecutor.sol) | This contract is a fork of Compound's `Timelock`. It acts as a timelocked treasury for the Nouns DAO. This contract is controlled by the governance contract (`NounsDAOProxy`). |
| [NounsDAOProxy](./contracts/governance/NounsDAOProxy.sol) | This contract is a fork of Compound's `GovernorBravoDelegator`. It can be used to create, vote on, and execute governance proposals. |
| [NounsDAOLogicV1](./contracts/governance/NounsDAOLogicV1.sol) | This contract is a fork of Compound's `GovernorBravoDelegate`. It's the logic contract used by the `NounsDAOProxy`. |

## Development
---

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

### Environment Setup

Copy `.env.example` to `.env` and fill in fields

### Commands

```sh
# compiling
npx hardhat compile

# deploying
npx hardhat run --network rinkeby scripts/deploy.js

# verifying on etherscan
npx hardhat verify --network rinkeby {DEPLOYED_ADDRESS}

# replace `rinkeby` with `mainnet` to productionize
```

### Automated Testnet Deployments

The contracts are deployed to Rinkeby on each push to master and each PR using the account `0x387d301d92AE0a87fD450975e8Aef66b72fBD718`. This account's mnemonic is stored in GitHub Actions as a secret and is injected as the environment variable `MNEMONIC`. This mnemonic _shouldn't be considered safe for mainnet use_.
