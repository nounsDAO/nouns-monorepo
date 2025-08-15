import { ponder } from 'ponder:registry';
import { noun } from 'ponder:schema';

// ponder.on("NounsToken:Approval", async ({ event, context }) => {
//   console.log(event.args);
// });

// ponder.on("NounsToken:ApprovalForAll", async ({ event, context }) => {
//   console.log(event.args);
// });

// ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
//   console.log(event.args);
// });

// ponder.on("NounsToken:DelegateVotesChanged", async ({ event, context }) => {
//   console.log(event.args);
// });

ponder.on('NounsToken:NounCreated', async ({ event, context }) => {
  await context.db.insert(noun).values({
    id: event.args.tokenId,
    head: event.args.seed.head,
    body: event.args.seed.body,
    accessory: event.args.seed.accessory,
    background: event.args.seed.background,
    createdAt: new Date(Number(event.block.timestamp)),
    createdAtBlock: event.block.number,
    createdAtTransaction: event.transaction.hash,
  });
});
