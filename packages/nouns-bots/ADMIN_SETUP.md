# Proposal-to-X Administrator Runbook

This runbook is for the Nouns maintainers who administer the production repository, the
nouns.wtf Netlify project, and the X account that will publish proposal posts. The service runs
inside the existing Nouns Netlify deployment and does not use Berry infrastructure.

## Before you start

One administrator, or a coordinated pair of administrators, needs access to:

- the X account that will publish the posts;
- the [X Developer Console](https://console.x.com/);
- the production nouns.wtf project in Netlify; and
- the Nouns monorepo production deployment workflow.

Use a shared organizational password manager for credentials. Never paste credentials into a
GitHub issue, pull request, repository file, build log, or chat message.

## 1. Create and fund the X app

1. Sign in to the X Developer Console and create a dedicated production app, such as
   `Nouns Proposal Publisher`.
2. Describe the app accurately: it publishes newly created Nouns DAO governance proposals from
   the official onchain proposal feed to the official Nouns X account.
3. Configure OAuth 1.0a user-context authentication with **Read and write** permissions. Direct
   Message permissions are not needed.
4. In **Keys and tokens**, generate and securely save:
   - API Key;
   - API Key Secret;
   - Access Token; and
   - Access Token Secret.
5. Confirm that the Access Token represents the exact X account that should publish. The API
   Key identifies the app; the Access Token identifies the user account. If the app is owned by
   a different account, the publishing account must authorize it through X's 3-legged OAuth
   flow.
6. If app permissions were changed after tokens were generated, re-authorize the app or
   regenerate the Access Token and Access Token Secret. Old tokens do not gain the new scope.
7. Add X API credits, configure a conservative spending limit, and assign someone to monitor
   the balance. X currently uses pay-per-usage pricing; confirm current rates in the Developer
   Console rather than relying on a hardcoded estimate.

The service uses OAuth 1.0a because creating posts requires user-context credentials. A Bearer
Token, OAuth 2.0 Client ID, or Client Secret cannot replace the four values above. See X's
[app credential guide](https://docs.x.com/fundamentals/developer-apps),
[OAuth 1.0a guide](https://docs.x.com/fundamentals/authentication/oauth-1-0a/overview), and
[current pricing](https://docs.x.com/x-api/getting-started/pricing).

## 2. Configure the Nouns Netlify project

In the production nouns.wtf Netlify project, go to **Project configuration → Environment
variables**. Add these site variables with the **Functions** scope and the **Production** deploy
context. If the Netlify plan does not expose variable scopes, use the default all-scopes setting
but still restrict the values to the Production context:

| Netlify variable        | X value                               | Required |
| ----------------------- | ------------------------------------- | -------- |
| `PROPOSAL_X_ENABLED`    | Start with `false`                    | Yes      |
| `X_API_KEY`             | API Key / Consumer Key                | Yes      |
| `X_API_SECRET`          | API Key Secret / Consumer Secret      | Yes      |
| `X_ACCESS_TOKEN`        | OAuth 1.0a user Access Token          | Yes      |
| `X_ACCESS_TOKEN_SECRET` | OAuth 1.0a user Access Token Secret   | Yes      |
| `X_EXPECTED_USERNAME`   | Publishing account handle without `@` | Yes      |

Then confirm that the official mainnet subgraph endpoint is available to Functions:

- If the existing `VITE_MAINNET_SUBGRAPH` variable already includes the Functions scope, no
  additional subgraph variable is required.
- Otherwise, add `NOUNS_SUBGRAPH_URL` with the same official Nouns subgraph endpoint and limit
  it to the Functions scope and Production context.

`SUBGRAPH_PAGE_SIZE` is optional and should normally remain unset. Do not add any X secret with
a `VITE_` prefix because Vite-prefixed values can be exposed to browser code.

Netlify captures environment values at deployment time. After adding or changing any variable,
create a new production deploy. See Netlify's
[Functions environment variable guide](https://docs.netlify.com/build/functions/environment-variables/).

## 3. Merge and verify the disabled deployment

1. Merge the proposal-to-X pull request into the branch used for the production nouns.wtf
   deployment.
2. Wait for the production Netlify deploy to finish successfully.
3. In Netlify, open **Functions** and select `proposal-x`.
4. Confirm it has a **Scheduled** badge and shows its next invocation. It should run every five
   minutes.
5. Select **Run now** once. The log should contain `Proposal X bot is disabled`. It must not
   create an X post or proposal cursor while disabled.

Scheduled functions run automatically only from published production deploys. Deploy Previews
can be invoked manually with **Run now**, but production credentials should not be exposed to
untrusted preview deploys. See Netlify's
[Scheduled Functions guide](https://docs.netlify.com/build/functions/scheduled-functions/).

## 4. Activate posting

1. Change `PROPOSAL_X_ENABLED` from `false` to `true` for the Functions scope and Production
   context.
2. Create a new production deploy so the function receives the new value.
3. Wait for the next scheduled invocation or use **Run now** once.
4. Confirm the function log contains `Initialized proposal X bot at proposal <id>`.
5. Open the Netlify **Blobs** page and confirm the `nouns-proposal-x` store contains the proposal
   cursor and worker lease. The first enabled invocation deliberately initializes at the latest
   proposal and does not post historical proposals.

After activation, **Run now** is a production action. It will publish any unprocessed proposal
that appeared after the cursor was initialized. Repeated invocations within the four-minute
lease window exit without posting.

Before publishing in each invocation, the service asks X for the authenticated user and compares
it with `X_EXPECTED_USERNAME`. A mismatch fails before creating a post, which prevents an
administrator's personal token from accidentally publishing to the wrong account.

When the next onchain proposal is indexed, verify all three results:

- Netlify logs `Published X post <post-id> for proposal <proposal-id>`;
- the `nouns-proposal-x` Blob store contains a posted delivery record; and
- the post appears on the intended X account with the matching nouns.wtf proposal link.

## 5. Pause, recover, or rotate credentials

### Normal pause

Set `PROPOSAL_X_ENABLED=false` and create a new production deploy. The cursor and delivery
records remain intact, so re-enabling does not duplicate already handled proposals. Proposals
created while the service is paused remain pending and will publish after it is re-enabled.

### Emergency stop

Revoke the app's Access Token in the X Developer Console. This stops authenticated posting
immediately, even before a Netlify deploy completes. Then set `PROPOSAL_X_ENABLED=false`, deploy,
and investigate before generating replacement credentials.

### Failed invocation

Inspect the `proposal-x` function log first. Common causes are an exhausted X API credit balance,
revoked or incorrectly scoped credentials, or an unavailable subgraph. Correct the external
condition, wait at least four minutes for the lease to expire, and use **Run now** once. The
service retains an interrupted delivery and checks the account timeline before retrying to
reduce duplicate-post risk.

### Credential rotation

1. Keep the service disabled or revoke the old token.
2. Generate replacement credentials in the X Developer Console. If the API Key changes,
   regenerate the user Access Token under that app as well.
3. Update all affected Netlify variables.
4. Create a new production deploy.
5. Re-enable the service, deploy again, and monitor the first invocation.

Do not delete or edit objects in the `nouns-proposal-x` Blob store during routine recovery. The
cursor and per-proposal delivery records are the service's idempotency history. Escalate any
state repair as a reviewed code or operations change.
