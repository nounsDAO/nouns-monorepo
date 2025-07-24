# @nouns/sdk

## Usage

The Nouns SDK contains useful tooling for interacting with the Nouns protocol.

### Contracts

This sdk uses [Wagmi CLI](https://wagmi.sh/cli/getting-started) to generate type-safe react hooks and actions for each contract method of all Nouns Contracts:

- [NounsGovernor](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d#code): The governance logic
- [NounsTreasury](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71#code): Current treasury and timelock
- [NounsLegacyTreasury](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10#code): Legacy treasury and timelock
- [NounsData](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365#code): Proposal Candidate and onchain comments contract
- [NounsToken](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03#code): The NFT
- [NounsAuctionHouse](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706#code): The auction contract
- [NounsDescriptor](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac#code): The NFT Descriptor (onchain artwork + metadata)
- [NounsStreamFactory](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff#code): A utility contract for streaming payments
- [NounsUSDCPayer](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D#code): Contract used to hold and disperse USDC payments for the DAO
- [NounsUSDCTokenBuyer](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5#code): Contract used to buy USDC tokens for the treasury

You can check the linked contracts above for all the available methods.

They're generated from the contract ABIs and include type-safe methods for all of the read and write functions.

> [!TIP]
> To get full IDE completions on the contract methods, ensure you have `strict` mode enabled in your `tsconfig.json` and that you fullfill all the [wagmi requirements](https://wagmi.sh/core/typescript#requirements)

#### Actions

Actions are framework-agnostic named wrappers around wagmi's methods that supply the abi, address and functionName parameters, so all you have to provide is the wagmi config and the call args.

The actions for each contract are available as a separate import:
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


Every read function is available as a wrapper around wagmi's [readContract](https://wagmi.sh/core/api/actions/readContract#readcontract) in the format: `read<ContractName><FunctionName>(wagmiConfig, args)`

e.g.:
```ts
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { readNounsAuctionHouseAuction } from '@nouns/sdk/auction-house';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const currentAuction = await readNounsAuctionHouseAuction(config, {})
// {
//     nounId: 1558n;
//     amount: 500000000000000000n;
//     startTime: 1753166495;
//     endTime: 1753252895;
//     bidder: "0xa0Cf2260CA43252A3620e80A5CFE40968f042634";
//     settled: false;
// }
```

Write functions are available both as wrappers around [writeContract](https://wagmi.sh/core/api/actions/writeContract#writecontract) and [simulateContract](https://wagmi.sh/core/api/actions/simulateContract#simulatecontract):

- `write<ContractName><FunctionName>(wagmiConfig, args)`
- `simulate<ContractName><FunctionName>(wagmiConfig, args)`

e.g.:
```ts
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { simulateNounsAuctionHouseCreateBid, writeNounsAuctionHouseCreateBid } from '@nouns/sdk/auctionHouse';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const nounId = 1500n;

// Throws an error if the simulation fails
await simulateNounsAuctionHouseCreateBid(config, {
  args: [nounId],
  value: 1_000_000_000n, // 1 ETH
});

const txHash = await writeNounsAuctionHouseCreateBid(config, {
  args: [nounId],
  value: 1_000_000_000n, // 1 ETH
});
```

Contract events can be watched using the [watchContractEvent](https://wagmi.sh/core/api/actions/watchContractEvent#watchcontractevent) wrappers: `watch<ContractName><EventName>Event(wagmiConfig, args)`

e.g.:
```ts
import { createConfig, http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { watchNounsAuctionHouseAuctionBidEvent } from '@nouns/sdk/auction-house';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const unwatch = watchNounsAuctionHouseAuctionBidEvent(config, {
  onLogs(logs) {
   logs.forEach((log) => {
      console.log("Auction bid event:", log.args);
      // {
      //   extended: false,
      //   sender: "0xa0Cf2260CA43252A3620e80A5CFE40968f042634",
      //   nounId: 1558n,
      //   value: 500000000000000000n,
      // }
    });
  },
})

unwatch(); //unsubscribe
```

#### React hooks

Every read/write/simulate/watch action also has a corresponding wagmi react hook. They're wrappers around [Wagmi React](https://wagmi.sh/react/getting-started)'s hooks, leveraging [WagmiProvider](https://wagmi.sh/react/api/WagmiProvider#wagmiprovider) for the config and [TanstackQuery](https://wagmi.sh/core/guides/framework-adapters#tanstack-query) for state management:

- `useRead<ContractName><FunctionName>(params)`
- `useWrite<ContractName><FunctionName>(params)`
- `useSimulate<ContractName><FunctionName>(params)`
- `useWatch<ContractName><EventName>Event(params)`


The hooks for each contract are available as a separate import:
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

example:

```tsx
import { useReadNounsGovernorVotingPeriod } from '@nouns/sdk/react/governor';

// Must be used inside of a <WagmiProvider/>
const { data } = useReadNounsGovernorVotingPeriod();
// data: 28800n
```

### Images

**Run-length Encode Images**

```ts
import { PNGCollectionEncoder } from '@nouns/sdk';
import { readPngFile } from 'node-libpng';
import { promises as fs } from 'fs';
import path from 'path';

const DESTINATION = path.join(__dirname, './output/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const folders = ['bodies', 'accessories', 'heads', 'glasses'];
  for (const folder of folders) {
    const folderpath = path.join(__dirname, './images', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      const image = await readPngFile(path.join(folderpath, file));
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder);
    }
  }
  await encoder.writeToFile(DESTINATION);
};

encode();
```

**Create SVGs from Run-length Encoded Data**

```ts
import { buildSVG } from '@nouns/sdk';

const svg = buildSVG(RLE_PARTS, PALETTE_COLORS, BACKGROUND_COLOR);
```

## Development

### Install dependencies

```sh
pnpm install
```

### Run tests

```sh
pnpm test
```

### Generate contract react hooks and actions using wagmi cli

```sh
pnpm codegen
```

### Build the package

```sh
pnpm build
```
