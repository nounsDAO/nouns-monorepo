import { ponder } from 'ponder:registry';
import { stream } from 'ponder:schema';

ponder.on('StreamFactory:StreamCreated', async ({ event, context }) => {
  await context.db.insert(stream).values({
    status: 'active',
    withdrawnAmount: 0n,
    streamAddress: event.args.streamAddress,
    creator: event.args.msgSender,
    payer: event.args.payer,
    recipient: event.args.recipient,
    tokenAmount: event.args.tokenAmount,
    tokenAddress: event.args.tokenAddress,
    startTime: new Date(Number(event.args.startTime)),
    stopTime: new Date(Number(event.args.stopTime)),
    createdAt: new Date(Number(event.block.timestamp)),
    createdAtBlock: event.block.number,
    createdAtTransaction: event.transaction.hash,
  });
});
