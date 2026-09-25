# Nouns Bots

Social automation deployed with the existing Nouns website on Netlify. The initial scheduled
function publishes newly indexed onchain proposals from the official Nouns subgraph to X with
a link to the proposal on [nouns.wtf](https://nouns.wtf/vote).

## Behavior

- Runs every five minutes as part of the nouns.wtf Netlify deployment.
- Reads the official Nouns subgraph maintained in this monorepo for new proposals.
- On its first boot, stores the latest proposal ID and does not backfill historical proposals.
- Publishes `Nouns DAO Proposal {id}: {title}` followed by `https://nouns.wtf/vote/{id}`.
- Stores its proposal cursor and per-proposal delivery records in site-wide Netlify Blobs.
- Uses a strongly consistent, conditional-write lease to prevent overlapping invocations from
  publishing duplicates.
- If a publish is interrupted, checks the authenticated account's recent posts for the
  proposal marker before retrying.

X does not expose an idempotency key for post creation. Timeline reconciliation narrows the
remaining duplicate risk to an X API outage that affects both post creation and subsequent
timeline reads.

## Setup

Administrators should follow the complete [production setup and operations runbook](ADMIN_SETUP.md).

Create an X developer app with read/write access and OAuth 1.0a user-context credentials for
the official account. Add the credentials below as server-only environment variables on the
Nouns Netlify site:

Required variables:

- `PROPOSAL_X_ENABLED` (`true` activates posting; every other value keeps it disabled)
- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`
- `X_EXPECTED_USERNAME` (without `@`; posting fails safely if the token belongs to another user)

The function reuses the site's existing `VITE_MAINNET_SUBGRAPH` value. An optional
`NOUNS_SUBGRAPH_URL` can override it without changing the webapp. The X user token must belong
to the publishing account. Never prefix the X values with `VITE_`, expose them to the webapp,
or commit them to the repository.

Netlify provides the `nouns-proposal-x` Blob store to the deployed function, so this service
does not require Redis, Railway, or any Berry infrastructure.

## Verification

```sh
pnpm build --filter=@nouns/bots
pnpm --filter @nouns/bots typecheck
pnpm --filter @nouns/bots test
pnpm --filter @nouns/bots lint
```

## Deployment

The root `netlify.toml` registers `src/functions/proposal-x.ts` as a scheduled function. It is
deployed automatically with the existing nouns.wtf site and runs only on published production
deploys. Posting is disabled by default. After administrators enable it and create a new
production deploy, the first enabled invocation initializes its cursor without posting
historical proposals.
