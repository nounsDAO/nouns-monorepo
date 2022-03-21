import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoRowBirthday from '../NounInfoRowBirthday';
import NounInfoRowHolder from '../NounInfoRowHolder';
import NounInfoRowButton from '../NounInfoRowButton';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';

interface NounInfoCardProps {
  nounId: number;
  bidHistoryOnClickHandler: () => void;
  isEthereum?: boolean;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId, bidHistoryOnClickHandler, isEthereum } = props;

  const etherscanBaseURL = buildEtherscanAddressLink(config.addresses.nounsToken);

  const etherscanButtonClickHandler = () => window.open(`${etherscanBaseURL}/${nounId}`, '_blank');

  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  return (
    <>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowButton
          iconImgSource={_BidsIcon}
          isEthereum={isEthereum}
          btnText={lastAuctionNounId === nounId ? 'Bids' : 'Bid history'}
          onClickHandler={bidHistoryOnClickHandler}
        />
        {/* <NounInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={'Etherscan'}
          onClickHandler={etherscanButtonClickHandler}
        /> */}
      </Col>
    </>
  );
};

export default NounInfoCard;
