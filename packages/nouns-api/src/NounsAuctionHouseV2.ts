import { ponder } from 'ponder:registry';
import { auction, bid } from 'ponder:schema';

ponder.on('NounsAuctionHouseV2:AuctionCreated', async ({ event, context }) => {
  await context.db.insert(auction).values({
    nounId: event.args.nounId,
    startTime: new Date(Number(event.args.startTime)),
    endTime: new Date(Number(event.args.endTime)),
    createdAt: new Date(Number(event.block.timestamp)),
    createdAtBlock: event.block.number,
    createdAtTransaction: event.transaction.hash,
  });
});

ponder.on('NounsAuctionHouseV2:AuctionExtended', async ({ event, context }) => {
  await context.db.update(auction, { nounId: event.args.nounId }).set({
    endTime: new Date(Number(event.args.endTime)),
  });
});

ponder.on('NounsAuctionHouseV2:AuctionBid', async ({ event, context }) => {
  await context.db.insert(bid).values({
    nounId: event.args.nounId,
    bidder: event.args.sender,
    value: event.args.value,
    createdAt: new Date(Number(event.block.timestamp)),
    createdAtBlock: event.block.number,
    createdAtTransaction: event.transaction.hash,
  });
});

ponder.on('NounsAuctionHouseV2:AuctionBidWithClientId', async ({ event, context }) => {
  await context.db.update(bid, { nounId: event.args.nounId, value: event.args.value }).set({
    clientId: event.args.clientId,
  });
});
