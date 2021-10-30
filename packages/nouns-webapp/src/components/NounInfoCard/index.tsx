import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoRowBirthday from '../NounInfoRowBirthday';
import NounInfoRowHolder from '../NounInfoRowHolder';
import NounInfoRowButton from '../NounInfoRowButton';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { useDispatch } from 'react-redux';

interface NounInfoCardProps {
  nounId: number;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const etherscanBaseURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const bidHistoryButtonClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId));
    history.push(`/auction/${nounId}`);
  };
  // eslint-disable-next-line no-restricted-globals
  const etherscanButtonClickHandler = () => (location.href = `${etherscanBaseURL}/${nounId}`);

  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  return (
    <>
      <Col lg={12}>
        <div className={classes.nounInfoHeader}>
          <h3>Profile</h3>
          <h2>Noun {nounId}</h2>
        </div>
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowBirthday nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowHolder nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={lastAuctionNounId === nounId ? 'Bids' : 'Bid history'}
          onClickHandler={bidHistoryButtonClickHandler}
        />
        <NounInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={'Etherscan'}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default NounInfoCard;
