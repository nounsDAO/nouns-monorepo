import { index, onchainEnum, onchainTable, primaryKey, relations } from 'ponder';

export const noun = onchainTable('nouns', t => ({
  id: t.bigint().primaryKey(),
  head: t.integer().notNull(),
  body: t.integer().notNull(),
  accessory: t.integer().notNull(),
  background: t.integer().notNull(),
  createdAt: t.timestamp().notNull(),
  createdAtBlock: t.bigint().notNull(),
  createdAtTransaction: t.text().notNull(),
}));

export const nounRelations = relations(noun, ({ one }) => ({
  auction: one(auction, {
    fields: [noun.id],
    references: [auction.nounId],
  }),
}));

export const proposal = onchainTable('proposal', t => ({
  id: t.bigint().primaryKey(),
  proposer: t.hex().notNull(),
  description: t.text().notNull(),
  createdAt: t.timestamp().notNull(),
  createdAtBlock: t.bigint().notNull(),
  createdAtTransaction: t.text().notNull(),
}));

export const proposalRelations = relations(proposal, ({ many }) => ({
  transactions: many(transaction),
  streams: many(stream),
}));

export const transaction = onchainTable(
  'transaction',
  t => ({
    index: t.integer(),
    proposalId: t.bigint().notNull(),
    target: t.hex().notNull(),
    value: t.bigint().notNull(),
    signature: t.text().notNull(),
    calldata: t.hex().notNull(),
  }),
  t => ({
    primaryKey: primaryKey({ columns: [t.index, t.proposalId] }),
  }),
);

export const transactionRelations = relations(transaction, ({ one }) => ({
  proposal: one(proposal, {
    fields: [transaction.proposalId],
    references: [proposal.id],
  }),
}));

export const auction = onchainTable('nounsAuctionHouseV2', t => ({
  nounId: t.bigint().primaryKey(),
  startTime: t.timestamp().notNull(),
  endTime: t.timestamp().notNull(),
  createdAt: t.timestamp().notNull(),
  createdAtBlock: t.bigint().notNull(),
  createdAtTransaction: t.text().notNull(),
}));

export const auctionRelations = relations(auction, ({ one, many }) => ({
  noun: one(noun, {
    fields: [auction.nounId],
    references: [noun.id],
  }),
  bids: many(bid),
}));

export const bid = onchainTable(
  'bid',
  t => ({
    nounId: t.bigint().notNull(),
    value: t.bigint().notNull(),
    bidder: t.hex().notNull(),
    clientId: t.integer(),
    createdAt: t.timestamp().notNull(),
    createdAtBlock: t.bigint().notNull(),
    createdAtTransaction: t.text().notNull(),
  }),
  t => ({
    primaryKey: primaryKey({ columns: [t.nounId, t.value] }),
  }),
);

export const bidRelations = relations(bid, ({ one }) => ({
  auction: one(auction, {
    fields: [bid.nounId],
    references: [auction.nounId],
  }),
}));

const streamStatusValues = ['active', 'cancelled', 'concluded'] as const;
export type StreamStatus = (typeof streamStatusValues)[number];
export const streamStatus = onchainEnum('streamStatus', streamStatusValues);

export const stream = onchainTable(
  'stream',
  t => ({
    proposalId: t.bigint(),
    streamAddress: t.hex().primaryKey(),
    status: streamStatus().notNull(),
    creator: t.hex().notNull(),
    payer: t.hex().notNull(),
    recipient: t.hex().notNull(),
    tokenAmount: t.bigint().notNull(),
    withdrawnAmount: t.bigint().notNull(),
    tokenAddress: t.hex().notNull(),
    startTime: t.timestamp().notNull(),
    stopTime: t.timestamp().notNull(),
    createdAt: t.timestamp().notNull(),
    createdAtBlock: t.bigint().notNull(),
    createdAtTransaction: t.text().notNull(),
  }),
  t => ({
    createdAtBlockIndex: index().on(t.createdAtBlock),
  }),
);

export const streamRelations = relations(stream, ({ one }) => ({
  proposal: one(proposal, {
    fields: [stream.proposalId],
    references: [proposal.id],
  }),
}));
