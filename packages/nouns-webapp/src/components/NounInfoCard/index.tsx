import React from 'react';
import { Row } from 'react-bootstrap';

import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoRowBirthday from '../NounInfoRowBirthday';
import NounInfoRowHolder from '../NounInfoRowHolder';
import NounInfoRowButton from '../NounInfoRowButton';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../hooks';

interface NounInfoCardProps {
  nounId: number;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId } = props;
  const history = useHistory();

  const etherscanBaseURL =
    'https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
  const bidHistoryButtonClickHandler = () => history.push(`/auction/${nounId}`);
  // eslint-disable-next-line no-restricted-globals
  const etherscanButtonClickHandler = () => (location.href = `${etherscanBaseURL}/${nounId}`);

  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  return (
    <>
      <Row>
        <div className={classes.nounInfoHeader}>
          <h3>Profile</h3>
          <h2>Noun {nounId}</h2>
        </div>
      </Row>
      <div>
        <Row className={classes.nounInfoRow}>
          <NounInfoRowBirthday nounId={nounId} />
        </Row>
        <Row className={classes.nounInfoRow}>
          <NounInfoRowHolder nounId={nounId} />
        </Row>
        <Row className={classes.nounInfoRow}>
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
        </Row>
      </div>
    </>
  );
};

export default NounInfoCard;
