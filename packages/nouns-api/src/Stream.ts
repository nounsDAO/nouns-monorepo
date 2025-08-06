import { ponder } from 'ponder:registry';
import { stream } from 'ponder:schema';

ponder.on('Stream:StreamCancelled', async ({ event, context }) => {
  await context.db.update(stream, { streamAddress: event.log.address }).set({
    status: 'cancelled',
  });
});

ponder.on('Stream:TokensWithdrawn', async ({ event, context }) => {
  await context.db.update(stream, { streamAddress: event.log.address }).set(stream => {
    const status = (() => {
      if (stream.status === 'cancelled') return 'cancelled';
      return stream.tokenAmount - stream.withdrawnAmount > 0n ? 'active' : 'concluded';
    })();

    return {
      status,
      withdrawnAmount: stream.withdrawnAmount + event.args.amount,
    };
  });
});
