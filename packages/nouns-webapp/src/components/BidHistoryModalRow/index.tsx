import classes from './BidHistoryModalRow.module.css';
import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { Bid } from '../../utils/types';
import clsx from 'clsx';
import auctionActivityClasses from '../AuctionActivity/BidHistory.module.css';
import _trophy from '../../assets/icons/trophy.svg';
import Davatar from '@davatar/react';
import { useEthers } from '@usedapp/core';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { i18n } from '@lingui/core';
import { shortENS, useShortAddress } from '../../utils/addressAndENSDisplayUtils';
interface BidHistoryModalRowProps {
  bid: Bid;
  index: number;
}

const BidHistoryModalRow: React.FC<BidHistoryModalRowProps> = props => {
  const { bid, index } = props;
  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const { library: provider } = useEthers();

  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;

  const ens = useReverseENSLookUp(bid.sender);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = useShortAddress(bid.sender);

  return (
    <li className={clsx(auctionActivityClasses.bidRowCool, classes.bidRow)}>
      <div className={auctionActivityClasses.bidItem}>
        <div className={auctionActivityClasses.leftSectionWrapper}>
          <div className={auctionActivityClasses.bidder}>
            <div className={classes.bidderInfoWrapper}>
              <Davatar size={40} address={bid.sender} provider={provider} />
              <div className={classes.bidderInfoText}>
                <span>
                  {ens && !ensMatchesBlocklistRegex ? shortENS(ens) : shortAddress}
                  {index === 0 && (
                    <img
                      src={_trophy}
                      alt="Winning bidder"
                      className={classes.trophy}
                      height={16}
                      width={16}
                    />
                  )}
                  <br />
                  <div className={classes.bidDate}>
                    {i18n.date(new Date(bid.timestamp.toNumber() * 1000), {
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
          <div className={clsx(classes.bidAmount, auctionActivityClasses.bidAmount)}>
            {bidAmount}
          </div>
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
