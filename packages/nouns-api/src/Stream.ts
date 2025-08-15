import { ponder } from 'ponder:registry';
import { stream, StreamStatus } from 'ponder:schema';

ponder.on('Stream:StreamCancelled', async ({ event, context }) => {
  await context.db.update(stream, { streamAddress: event.log.address }).set({
    status: 'cancelled',
  });
});

ponder.on('Stream:TokensWithdrawn', async ({ event, context }) => {
  await context.db.update(stream, { streamAddress: event.log.address }).set(stream => {
    return {
      status: updatedStreamStatus(stream),
      withdrawnAmount: stream.withdrawnAmount + event.args.amount,
    };
  });
});

const updatedStreamStatus = ({
  status,
  tokenAmount,
  withdrawnAmount,
}: {
  status: StreamStatus;
  tokenAmount: bigint;
  withdrawnAmount: bigint;
}) => {
  if (status === 'cancelled') return 'cancelled';
  return tokenAmount - withdrawnAmount > 0n ? 'active' : 'concluded';
};
