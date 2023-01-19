import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './N00unInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import N00unInfoRowBirthday from '../N00unInfoRowBirthday';
import N00unInfoRowHolder from '../N00unInfoRowHolder';
import N00unInfoRowButton from '../N00unInfoRowButton';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanTokenLink } from '../../utils/etherscan';
import { Trans } from '@lingui/macro';

interface N00unInfoCardProps {
  n00unId: number;
  bidHistoryOnClickHandler: () => void;
}

const N00unInfoCard: React.FC<N00unInfoCardProps> = props => {
  const { n00unId, bidHistoryOnClickHandler } = props;

  const etherscanButtonClickHandler = () =>
    window.open(buildEtherscanTokenLink(config.addresses.n00unsToken, n00unId));

  const lastAuctionN00unId = useAppSelector(state => state.onDisplayAuction.lastAuctionN00unId);

  return (
    <>
      <Col lg={12} className={classes.n00unInfoRow}>
        <N00unInfoRowBirthday n00unId={n00unId} />
      </Col>
      <Col lg={12} className={classes.n00unInfoRow}>
        <N00unInfoRowHolder n00unId={n00unId} />
      </Col>
      <Col lg={12} className={classes.n00unInfoRow}>
        <N00unInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={
            lastAuctionN00unId === n00unId ? <Trans>Bids</Trans> : <Trans>Bid history</Trans>
          }
          onClickHandler={bidHistoryOnClickHandler}
        />
        <N00unInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={<Trans>Etherscan</Trans>}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default N00unInfoCard;
