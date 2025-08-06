import { eq } from 'ponder';
import { ponder } from 'ponder:registry';
import { proposal, stream, transaction } from 'ponder:schema';

ponder.on('NounsDAOV4:ProposalCreated', async ({ event, context }) => {
  await context.db.insert(proposal).values({
    id: event.args.id,
    description: event.args.description,
    createdAt: new Date(Number(event.block.timestamp)),
    createdAtBlock: event.block.number,
    createdAtTransaction: event.transaction.hash,
    proposer: event.args.proposer,
  });

  await context.db.insert(transaction).values(
    event.args.targets.map((target, index) => ({
      index,
      proposalId: event.args.id,
      target,
      value: event.args.values[index]!,
      signature: event.args.signatures[index]!,
      calldata: event.args.calldatas[index]!,
    })),
  );
});

ponder.on('NounsDAOV4:ProposalExecuted', async ({ event, context }) => {
  await context.db.sql
    .update(stream)
    .set({ proposalId: event.args.id })
    .where(eq(stream.createdAtBlock, event.block.number));
});
