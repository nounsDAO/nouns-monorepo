import { useQuery } from '@apollo/client';
import React from 'react';
import { Image } from 'react-bootstrap';
import _LinkIcon from '../../assets/icons/Link.svg';
import { nounQuery } from '../../wrappers/subgraph';
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from './NounInfoRowHolder.module.css';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';

import { useAppSelector } from '../../hooks';

interface NounInfoRowHolderProps {
  nounId: number;
}

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
  const { nounId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const { loading, error, data } = useQuery(nounQuery(nounId.toString()));

  const etherscanURL = buildEtherscanAddressLink(data && data.noun.owner.id);

  if (loading) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>Loading...</span>
      </div>
    );
  } else if (error) {
    return <div>Failed to fetch noun info</div>;
  }

  const shortAddressComponent = <ShortAddress address={data && data.noun.owner.id} />;

  return (
    <div className={classes.nounHolderInfoContainer}>
      <span>
        <Image src={_HeartIcon} className={classes.heartIcon} />
      </span>
      <span>Held by</span>
      <span>
        <a
          className={
            isCool ? classes.nounHolderEtherscanLinkCool : classes.nounHolderEtherscanLinkWarm
          }
          href={etherscanURL}
          target={'_blank'}
          rel="noreferrer"
        >
          {data.noun.owner.id.toLowerCase() ===
          config.addresses.nounsAuctionHouseProxy.toLowerCase()
            ? 'Nouns Auction House'
            : shortAddressComponent}
        </a>
      </span>
      <span className={classes.linkIconSpan}>
        <Image src={_LinkIcon} className={classes.linkIcon} />
      </span>
    </div>
  );
};

export default NounInfoRowHolder;
