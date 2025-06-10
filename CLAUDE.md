# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo for Nouns DAO, a generative avatar art collective run by crypto misfits. The project uses:
- **pnpm** as the package manager (required version 10.10.0+)
- **Turbo** for monorepo build orchestration
- **TypeScript** throughout the codebase
- **Node.js** 16.x or higher

## Package Structure

Five main packages with interdependencies:

1. **nouns-assets** - PNG and run-length encoded Noun image data
2. **nouns-contracts** - Solidity smart contracts for Nouns DAO (uses Hardhat + Foundry)
3. **nouns-sdk** - Contract addresses, ABIs, instances, and image utilities
4. **nouns-webapp** - React frontend (Vite + Tailwind + i18n)
5. **nouns-subgraph** - The Graph subgraph manifests

Build dependencies: webapp depends on assets → contracts → sdk.

## Essential Commands

### Development
```bash
pnpm install          # Install all dependencies
pnpm dev              # Start development servers (builds dependencies first)
pnpm build            # Build all packages
pnpm test             # Run tests across all packages
```

### Code Quality
```bash
pnpm lint             # ESLint with caching
pnpm format           # Prettier formatting
```

### Package-Specific Work
```bash
# Work in specific package
cd packages/nouns-webapp
pnpm dev              # Start webapp dev server
pnpm test             # Run package tests
pnpm build            # Build package
```

## Smart Contract Development

Located in `packages/nouns-contracts/`:
- Uses both **Hardhat** and **Foundry** for testing/deployment
- Tests in `test/` (TypeScript) and `test/foundry/` (Solidity)
- Deployment scripts in `script/`
- Generated TypeChain types in `typechain/`

Key contracts:
- `NounsToken` - ERC721 for Noun NFTs
- `NounsAuctionHouse` - Auction mechanism
- `governance/` - DAO governance contracts
- `NounsDescriptor` - SVG generation and metadata

## Frontend Architecture (nouns-webapp)

Located in `packages/nouns-webapp/` - React web application built with Vite, TypeScript, and Wagmi.

### Tech Stack
- **React 18** with **Vite** build tool
- **Tailwind CSS** + **shadcn/ui** for styling (migrating from CSS Modules + react-bootstrap)
- **wagmi** for Ethereum interactions
- **TanStack Query** for server state (replacing Redux + Apollo Client)
- **Lingui** for internationalization
- **GraphQL Codegen** for type-safe subgraph queries

### State Management (In Migration)
- **Redux Toolkit**: Legacy global state with slices (being phased out)
- **TanStack Query**: Modern async state management for server state
- **Wagmi**: Ethereum wallet connection and contract interactions

Key state slices: `account`, `auction`, `candidates`, `onDisplayAuction`

### Data Sources
- **The Graph**: Subgraph queries via TanStack Query + GraphQL Codegen
- **Direct RPC**: Real-time contract calls via Wagmi
- **IPFS**: Proposal metadata storage

Pattern: Use `useQuery` with `execute()` function from GraphQL Codegen (see `src/index.tsx:202-205`)

### Key Directories
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/wrappers/` - Contract interaction wrappers
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/contracts/` - Auto-generated contract types via Wagmi CLI

### Webapp-Specific Commands
```bash
# From packages/nouns-webapp directory
cp .env.example.local .env    # Setup environment
pnpm dev                      # Start dev server on port 3000
pnpm test:watch               # Run tests in watch mode
pnpm test:coverage            # Run tests with coverage
pnpm graphql-codegen          # Generate GraphQL types
pnpm i18n:extract             # Extract translation strings
pnpm i18n:compile             # Compile translations
```

### Routing Structure
- `/` - Current auction
- `/noun/:id` - Specific noun auction
- `/vote` - Governance proposals list
- `/vote/:id` - Specific proposal
- `/candidates/:id` - Proposal candidates
- `/playground` - Noun trait playground
- `/fork/:id` - Fork-specific pages

## Image System

The image generation system spans multiple packages:
- `nouns-assets` contains PNG files and encoded data
- `nouns-sdk` provides SVG building utilities
- Image encoding scripts in `nouns-assets/scripts/`

## Environment Variables

Required for webapp development (prefix with `VITE_`):
- `VITE_CHAIN_ID`: Target blockchain (1 for mainnet, 11155111 for sepolia)
- `VITE_MAINNET_SUBGRAPH`: The Graph endpoint for mainnet
- `VITE_SEPOLIA_SUBGRAPH`: The Graph endpoint for sepolia
- `VITE_ETHERSCAN_API_KEY`: For contract verification
- `VITE_WALLET_CONNECT_V2_PROJECT_ID`: WalletConnect integration

Optional:
- `VITE_MAINNET_JSONRPC`: Custom RPC endpoint (defaults to Infura)
- `VITE_ENABLE_HISTORY`: Enable proposal history features
- `VITE_ENABLE_REDUX_LOGGER`: Enable Redux action logging in dev

## Testing

Each package has its own test setup:
- **Assets/SDK**: Node.js with standard test runners
- **Contracts**: Hardhat (TypeScript) + Foundry (Solidity)
- **Webapp**: Vitest + React Testing Library
- **Subgraph**: Matchstick framework

Run `pnpm test` from root to test all packages, or `cd` into specific package for targeted testing.

## Active Migrations (nouns-webapp)

The webapp is undergoing modernization efforts:

### State Management Migration
**From**: Redux Toolkit + Apollo Client  
**To**: TanStack Query for server state, minimal Redux for UI state  
**Guidance**: Prefer TanStack Query for new data fetching, use Redux only for truly global UI state

### Styling Migration  
**From**: CSS Modules + react-bootstrap  
**To**: Tailwind CSS + shadcn/ui  
**Guidance**: Use Tailwind classes and shadcn/ui components for new features

### GraphQL Migration
**From**: Apollo Client with manual queries  
**To**: TanStack Query + GraphQL Codegen with typed `execute()` function  
**Guidance**: New GraphQL queries should use the codegen'd `execute()` pattern

## Code Generation Dependencies

The build process depends on:
1. **Contract ABIs**: Generated from Etherscan via Wagmi CLI
2. **GraphQL Types**: Generated from subgraph schema via GraphQL Codegen
3. **i18n Strings**: Extracted via Lingui macro processing

Always run code generation after:
- Adding new contract interactions
- Modifying GraphQL queries
- Adding new translatable strings

## Feature Flags (nouns-webapp)

Feature toggles in `src/config.ts`:
- `daoGteV3`: DAO v3+ features
- `proposeOnV1`: Legacy proposal creation
- `candidates`: Proposal candidates system
- `fork`: Fork-related functionality

## Local Development with Contracts

For full local development:
1. Start local blockchain: `cd packages/nouns-contracts && pnpm task:run-local`
2. Use hardhat chain ID (31337) in environment
3. Import development private key to MetaMask: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`