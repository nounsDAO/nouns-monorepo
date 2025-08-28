'use client';

import React from 'react';

import { Trans } from '@lingui/react/macro';

import BidHistoryModalRow from '@/components/bid-history-modal-row';
import { StandaloneNounRoundedCorners } from '@/components/standalone-noun';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Bid } from '@/utils/types';
import { Auction } from '@/wrappers/nouns-auction';
import { useAuctionBids } from '@/wrappers/on-display-auction';

type BidHistoryModalProps = {
  auction: Auction;
  onDismiss: () => void;
};

const BidHistoryModal: React.FC<BidHistoryModalProps> = ({ auction, onDismiss }) => {
  const bids = useAuctionBids(BigInt(auction.nounId));

  return (
    <Dialog open onOpenChange={open => !open && onDismiss()}>
      <DialogContent className="font-pt bg-brand-surface shadow-quorum-modal w-[40rem] max-w-[90vw] border-0 p-6 font-bold lg-max:bg-transparent lg-max:shadow-none sm:rounded-[24px]">
        <div className="max-h-[50vh] overflow-y-hidden rounded-[24px] lg-max:h-full lg-max:max-h-full">
          <div className="flex items-start gap-2">
            <div className="mr-4 size-24 shrink-0 overflow-hidden rounded-[12px]">
              <StandaloneNounRoundedCorners nounId={BigInt(auction.nounId)} />
            </div>

            <div className="flex flex-col">
              <h2 className="font-londrina text-brand-text-muted-600 mt-2 text-[24px]">
                <Trans>Bids for</Trans>
              </h2>
              <h1 className="font-londrina text-brand-cool-deep h-8 rounded-[24px] text-[42px] leading-[25px] lg-max:leading-[0px] lg-max:text-white">
                Noun {auction.nounId.toString()}
              </h1>
            </div>
          </div>
          <div className="bg-brand-surface-elevated shadow-bid-wrapper mt-4 h-[35vh] overflow-y-scroll rounded-[16px] p-3 lg-max:h-full lg-max:rounded-none lg-max:bg-transparent lg-max:p-0 lg-max:shadow-none">
            {(bids?.length ?? 0) > 0 ? (
              <ul className="list-none p-0">
                {bids?.map((bid: Bid) => (
                  <BidHistoryModalRow
                    key={bid.transactionHash}
                    index={bid.transactionIndex}
                    bid={bid}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-brand-cool-deep mt-12 text-center text-[24px] lg-max:text-white">
                <Trans>Bids will appear here</Trans>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BidHistoryModal;
