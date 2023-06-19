import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './VrbInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import InfoRowBirthday from '../InfoRowBirthday';
import VrbInfoRowHolder from '../VrbInfoRowHolder';
import VrbInfoRowButton from '../VrbInfoRowButton';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanTokenLink } from '../../utils/etherscan';
import { Trans } from '@lingui/macro';

interface VrbInfoCardProps {
  vrbId: number;
  bidHistoryOnClickHandler: () => void;
}

const VrbInfoCard: React.FC<VrbInfoCardProps> = props => {
  const { vrbId, bidHistoryOnClickHandler } = props;

  const etherscanButtonClickHandler = () =>
    window.open(buildEtherscanTokenLink(config.addresses.vrbsToken, vrbId));

  const lastAuctionVrbId = useAppSelector(state => state.onDisplayAuction.lastAuctionVrbId);

  return (
    <>
      <Col lg={12} className={classes.vrbInfoRow}>
        <InfoRowBirthday vrbId={vrbId} />
      </Col>
      <Col lg={12} className={classes.vrbInfoRow}>
        <VrbInfoRowHolder vrbId={vrbId} />
      </Col>
      <Col lg={12} className={classes.vrbInfoRow}>
        <VrbInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={
            lastAuctionVrbId === vrbId ? <Trans>Bids</Trans> : <Trans>Bid history</Trans>
          }
          onClickHandler={bidHistoryOnClickHandler}
        />
        <VrbInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={<Trans>Etherscan</Trans>}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default VrbInfoCard;
