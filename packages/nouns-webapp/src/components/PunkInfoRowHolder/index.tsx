import { useQuery } from '@apollo/client';
import React from 'react';
import { Image } from 'react-bootstrap';
import _LinkIcon from '../../assets/icons/Link.svg';
import { auctionQuery } from '../../wrappers/subgraph';
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from './PunkInfoRowHolder.module.css';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';

import { useAppSelector } from '../../hooks';
import { Trans } from '@lingui/macro';
import Tooltip from '../Tooltip';

interface PunkInfoRowHolderProps {
  tokenId: number;
}

const PunkInfoRowHolder: React.FC<PunkInfoRowHolderProps> = props => {
  const { tokenId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const { loading, error, data } = useQuery(auctionQuery(tokenId));

  const winner = data?.auction.bidder?.id;

  if (loading) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>
          <Trans>Loading...</Trans>
        </span>
      </div>
    );
  } else if (!winner) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>
          <Trans>No bids yet</Trans>
        </span>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Trans>Failed to fetch Punk info</Trans>
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
      <div className={classes.nounHolderInfoContainer}>
        <span>
          <Image src={_HeartIcon} className={classes.heartIcon} />
        </span>
        <span>
          <Trans>Winner</Trans>
        </span>
        <span>
          <a
            className={
              isCool ? classes.nounHolderEtherscanLinkCool : classes.nounHolderEtherscanLinkWarm
            }
            href={etherscanURL}
            target={'_blank'}
            rel="noreferrer"
          >
            {winner.toLowerCase() === config.addresses.nAuctionHouseProxy.toLowerCase() ? (
              <Trans>Punks Auction House</Trans>
            ) : (
              shortAddressComponent
            )}
          </a>
        </span>
        <span className={classes.linkIconSpan}>
          <Image src={_LinkIcon} className={classes.linkIcon} />
        </span>
      </div>
    </Tooltip>
  );
};

export default PunkInfoRowHolder;
