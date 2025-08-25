import React from 'react';

import { ExternalLinkIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { blo } from 'blo';

import _trophy from '@/assets/icons/trophy.svg';
import TruncatedAmount from '@/components/truncated-amount';
import { cn } from '@/lib/utils';
import { shortENS, formatShortAddress } from '@/utils/address-and-ens-display-utils';
import { useReverseENSLookUp } from '@/utils/ens-lookup';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { containsBlockedText } from '@/utils/moderation/contains-blocked-text';
import { Address, Bid } from '@/utils/types';

import classes from './bid-history-modal-row.module.css';

import auctionActivityClasses from '@/components/auction-activity/bid-history.module.css';

interface BidHistoryModalRowProps {
  bid: Bid;
  index: number;
}

const BidHistoryModalRow: React.FC<BidHistoryModalRowProps> = ({ bid, index }) => {
  const txLink = buildEtherscanTxLink(bid.transactionHash);

  const bidAmount = <TruncatedAmount amount={BigInt(bid.value.toString())} />;

  const ens = useReverseENSLookUp(bid.sender);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = formatShortAddress(bid.sender);

  return (
    <li className={cn(auctionActivityClasses.bidRowCool, classes.bidRow)}>
      <div className={auctionActivityClasses.bidItem}>
        <div className={auctionActivityClasses.leftSectionWrapper}>
          <div className={auctionActivityClasses.bidder}>
            <div className={classes.bidderInfoWrapper}>
              <img
                alt={bid.sender}
                src={blo(bid.sender as Address)}
                className="size-10 rounded-full"
              />
              <div className={classes.bidderInfoText}>
                <span>
                  {ens && !ensMatchesBlocklistRegex ? shortENS(ens) : shortAddress}
                  {index === 0 && (
                    <img
                      src={_trophy}
                      alt="Winning bidder"
                      className={'ml-1 inline-block size-4'}
                    />
                  )}
                  <div className={classes.bidDate}>
                    {i18n.date(new Date(Number(bid.timestamp) * 1000), {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={auctionActivityClasses.rightSectionWrapper}>
          <div className={cn(classes.bidAmount, auctionActivityClasses.bidAmount)}>{bidAmount}</div>
          <div className={auctionActivityClasses.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <div className={classes.linkIcon}>
                <ExternalLinkIcon height={24} width={24} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BidHistoryModalRow;
