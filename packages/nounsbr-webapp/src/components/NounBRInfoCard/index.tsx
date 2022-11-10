import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './NounBRInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounBRInfoRowBirthday from '../NounBRInfoRowBirthday';
import NounBRInfoRowHolder from '../NounBRInfoRowHolder';
import NounBRInfoRowButton from '../NounBRInfoRowButton';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanTokenLink } from '../../utils/etherscan';
import { Trans } from '@lingui/macro';

interface NounBRInfoCardProps {
  nounbrId: number;
  bidHistoryOnClickHandler: () => void;
}

const NounBRInfoCard: React.FC<NounBRInfoCardProps> = props => {
  const { nounbrId, bidHistoryOnClickHandler } = props;

  const etherscanButtonClickHandler = () =>
    window.open(buildEtherscanTokenLink(config.addresses.nounsbrToken, nounbrId));

  const lastAuctionNounBRId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounBRId);

  return (
    <>
      <Col lg={12} className={classes.nounbrInfoRow}>
        <NounBRInfoRowBirthday nounbrId={nounbrId} />
      </Col>
      <Col lg={12} className={classes.nounbrInfoRow}>
        <NounBRInfoRowHolder nounbrId={nounbrId} />
      </Col>
      <Col lg={12} className={classes.nounbrInfoRow}>
        <NounBRInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={lastAuctionNounBRId === nounbrId ? <Trans>Bids</Trans> : <Trans>Bid history</Trans>}
          onClickHandler={bidHistoryOnClickHandler}
        />
        <NounBRInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={<Trans>Etherscan</Trans>}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default NounBRInfoCard;
