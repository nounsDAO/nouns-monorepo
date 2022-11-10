import { useQuery } from '@apollo/client';
import React from 'react';
import { Image } from 'react-bootstrap';
import _LinkIcon from '../../assets/icons/Link.svg';
import { auctionQuery } from '../../wrappers/subgraph';
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from './NounBRInfoRowHolder.module.css';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';

import { useAppSelector } from '../../hooks';
import { Trans } from '@lingui/macro';
import Tooltip from '../Tooltip';

interface NounBRInfoRowHolderProps {
  nounbrId: number;
}

const NounBRInfoRowHolder: React.FC<NounBRInfoRowHolderProps> = props => {
  const { nounbrId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const { loading, error, data } = useQuery(auctionQuery(nounbrId));

  const winner = data && data.auction.bidder?.id;

  if (loading || !winner) {
    return (
      <div className={classes.nounbrHolderInfoContainer}>
        <span className={classes.nounbrHolderLoading}>
          <Trans>Loading...</Trans>
        </span>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Trans>Failed to fetch NounBR info</Trans>
      </div>
    );
  }

  const etherscanURL = buildEtherscanAddressLink(winner);
  const shortAddressComponent = <ShortAddress address={winner} />;

  return (
    <Tooltip
      tip="View on Etherscan"
      tooltipContent={(tip: string) => {
        return <Trans>View on Etherscan</Trans>;
      }}
      id="holder-etherscan-tooltip"
    >
      <div className={classes.nounbrHolderInfoContainer}>
        <span>
          <Image src={_HeartIcon} className={classes.heartIcon} />
        </span>
        <span>
          <Trans>Winner</Trans>
        </span>
        <span>
          <a
            className={
              isCool ? classes.nounbrHolderEtherscanLinkCool : classes.nounbrHolderEtherscanLinkWarm
            }
            href={etherscanURL}
            target={'_blank'}
            rel="noreferrer"
          >
            {winner.toLowerCase() === config.addresses.nounsbrAuctionHouseProxy.toLowerCase() ? (
              <Trans>NounsBR Auction House</Trans>
            ) : (
              shortAddressComponent
            )}
            <span className={classes.linkIconSpan}>
              <Image src={_LinkIcon} className={classes.linkIcon} />
            </span>
          </a>
        </span>
      </div>
    </Tooltip>
  );
};

export default NounBRInfoRowHolder;
