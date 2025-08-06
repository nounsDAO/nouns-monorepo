# Nouns API

A [ponder.sh](https://ponder.sh) based API for Nouns. Intended as a replacement for `nouns-subgraph`

## Getting started

Install dependencies

```bash
pnpm i
```

Create a .env file and fill in with your Ethereum node endpoints:

```env
#.env
# At least one of them should be provided.
PONDER_RPC_URL_1="https://<json-rpc-url>"
# A websockets endpoint offers better performance.
PONDER_WS_URL_1="wss://<websockets-url>"
```

Fetch a ponder snapshot for faster historical sync

```bash
pnpm ponder:restore-snapshot
```

Run dev server

```bash
pnpm dev
```

## Deploying

Deploy on railway.app following the guide on https://ponder.sh/docs/production/railway

you can use [railway.json](./railway.json) for the service configs
