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
      <DialogContent className="font-pt w-[40rem] max-w-[90vw] border-0 bg-[#f4f4f8] p-6 font-bold shadow-[0_0_24px_rgba(0,0,0,0.05)] max-[992px]:bg-transparent max-[992px]:shadow-none sm:rounded-[24px]">
        <div className="max-h-[50vh] overflow-y-hidden rounded-[24px] max-[992px]:h-full max-[992px]:max-h-full">
          <div className="flex items-start gap-4">
            <div className="mr-4 h-24 w-24 shrink-0 overflow-hidden rounded-[12px]">
              <StandaloneNounRoundedCorners nounId={BigInt(auction.nounId)} />
            </div>

            <div className="flex flex-col">
              <h2 className="font-londrina mt-2 text-[24px] text-[rgba(140,141,146,1)]">
                <Trans>Bids for</Trans>
              </h2>
              <h1 className="font-londrina h-8 rounded-[24px] text-[42px] leading-[25px] text-[#1b2140] max-[992px]:leading-[0px] max-[992px]:text-white">
                Noun {auction.nounId.toString()}
              </h1>
            </div>
          </div>
          <div className="mt-4 h-[35vh] overflow-y-scroll rounded-[16px] bg-[#e0e0e7] p-3 shadow-[inset_0_-12px_16px_rgba(0,0,0,0.08)] max-[992px]:h-full max-[992px]:rounded-none max-[992px]:bg-transparent max-[992px]:p-0 max-[992px]:shadow-none">
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
              <div className="mt-12 text-center text-[24px] text-[#1b2140] max-[992px]:text-white">
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
