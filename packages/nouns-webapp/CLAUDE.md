# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a React web application for the Nouns DAO built with Vite, TypeScript, and Wagmi.

### Setup
```bash
# From monorepo root, install dependencies and build contracts
pnpm install

# From packages/nouns-webapp directory
cp .env.example.local .env  # For local development
pnpm dev                    # Start development server on port 3000
```

### Core Commands
```bash
pnpm dev                    # Development server
pnpm build                  # Production build (includes prebuild steps)
pnpm preview                # Preview production build
pnpm test                   # Run tests once
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Run tests with coverage
```

### Code Generation
```bash
pnpm graphql-codegen        # Generate GraphQL types from subgraph
pnpm graphql-codegen:watch  # Watch mode for GraphQL codegen
wagmi generate              # Generate contract types (auto-runs in prebuild)
```

### Internationalization
```bash
pnpm i18n:extract           # Extract strings for translation
pnpm i18n:compile           # Compile translations
pnpm i18n:pseudo            # Generate pseudo-locale for testing
```

## Architecture Overview

### State Management (In Migration)
- **Redux Toolkit**: Legacy global state with slices (being phased out)
- **TanStack Query**: Modern async state management for server state (replacing Redux + Apollo)
- **Wagmi**: Ethereum wallet connection and contract interactions

### Key State Slices
- `account`: Active wallet account
- `auction`: Current auction state
- `candidates`: Proposal candidates system
- `onDisplayAuction`: Currently displayed auction/noun

### Contract Integration
- **Contract Types**: Auto-generated in `src/contracts/` via Wagmi CLI
- **Addresses**: Configured per chain in `src/config.ts`
- **Chains**: Supports mainnet, sepolia, and local hardhat

### Data Sources (In Migration)
- **The Graph**: Subgraph queries via TanStack Query + GraphQL Codegen (replacing Apollo Client)
- **Direct RPC**: Real-time contract calls via Wagmi
- **IPFS**: Proposal metadata storage

Note: See `src/index.tsx:202-205` for example of new TanStack Query pattern with `execute()` function from GraphQL Codegen.

### Routing Structure
- `/` - Current auction
- `/noun/:id` - Specific noun auction
- `/vote` - Governance proposals list
- `/vote/:id` - Specific proposal
- `/candidates/:id` - Proposal candidates
- `/playground` - Noun trait playground
- `/fork/:id` - Fork-specific pages

### Component Organization
- **Pages**: Top-level route components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Layout**: Section wrapper components
- **UI**: Base UI components (using shadcn/ui patterns)

### Styling (In Migration)
- **Tailwind CSS**: Primary utility-first CSS framework
- **shadcn/ui**: Modern component library (replacing react-bootstrap)
- **CSS Modules**: Legacy component-scoped styles (.module.css) - being phased out
- **Bootstrap**: Legacy UI components - being replaced

### Testing
- **Vitest**: Test runner with jsdom environment
- **Testing Library**: React component testing utilities
- **Setup**: Tests configured with `vitest.setup.ts`

### Internationalization
- **Lingui**: i18n framework with macro-based string extraction
- **Locales**: en-US (default), ja-JP, zh-CN, pseudo
- **Format**: PO files in `src/locales/`

## Environment Configuration

### Required Environment Variables
- `VITE_CHAIN_ID`: Target blockchain (1 for mainnet, 11155111 for sepolia)
- `VITE_MAINNET_SUBGRAPH`: The Graph endpoint for mainnet
- `VITE_SEPOLIA_SUBGRAPH`: The Graph endpoint for sepolia
- `VITE_ETHERSCAN_API_KEY`: For contract verification
- `VITE_WALLET_CONNECT_V2_PROJECT_ID`: WalletConnect integration

### Optional Environment Variables
- `VITE_MAINNET_JSONRPC`: Custom RPC endpoint (defaults to Infura)
- `VITE_ENABLE_HISTORY`: Enable proposal history features
- `VITE_ENABLE_REDUX_LOGGER`: Enable Redux action logging in dev

## Active Migrations

This codebase is undergoing several modernization efforts:

### State Management Migration
**From**: Redux Toolkit + Apollo Client  
**To**: TanStack Query for server state, minimal Redux for UI state  
**Pattern**: Use `useQuery` with `execute()` function from GraphQL Codegen (see `src/index.tsx:202-205`)  
**Guidance**: Prefer TanStack Query for new data fetching, only use Redux for truly global UI state

### Styling Migration  
**From**: CSS Modules + react-bootstrap  
**To**: Tailwind CSS + shadcn/ui  
**Guidance**: Use Tailwind classes and shadcn/ui components for new features, gradually replace existing CSS Modules

### GraphQL Migration
**From**: Apollo Client with manual queries  
**To**: TanStack Query + GraphQL Codegen with typed `execute()` function  
**Guidance**: New GraphQL queries should use the codegen'd `execute()` pattern with TanStack Query

## Code Generation Dependencies

The build process depends on:
1. **Contract ABIs**: Generated from Etherscan via Wagmi CLI
2. **GraphQL Types**: Generated from subgraph schema via GraphQL Codegen
3. **i18n Strings**: Extracted via Lingui macro processing

Always run code generation after:
- Adding new contract interactions
- Modifying GraphQL queries
- Adding new translatable strings

## Feature Flags

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