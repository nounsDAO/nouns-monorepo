import React from 'react';

import { Trans } from '@lingui/react/macro';
import { Col } from 'react-bootstrap';

import _AddressIcon from '@/assets/icons/Address.svg';
import _BidsIcon from '@/assets/icons/Bids.svg';
import NounInfoRowBirthday from '@/components/NounInfoRowBirthday';
import NounInfoRowButton from '@/components/NounInfoRowButton';
import NounInfoRowHolder from '@/components/NounInfoRowHolder';
import config from '@/config';
import { useAppSelector } from '@/hooks';
import { buildEtherscanTokenLink } from '@/utils/etherscan';

import classes from './NounInfoCard.module.css';

interface NounInfoCardProps {
  nounId: bigint;
  bidHistoryOnClickHandler: () => void;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId, bidHistoryOnClickHandler } = props;

  const etherscanButtonClickHandler = () =>
    window.open(buildEtherscanTokenLink(config.addresses.nounsToken, Number(nounId)));

  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  return (
    <>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowBirthday nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowHolder nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={
            lastAuctionNounId !== undefined && BigInt(lastAuctionNounId) === nounId ? (
              <Trans>Bids</Trans>
            ) : (
              <Trans>Bid history</Trans>
            )
          }
          onClickHandler={bidHistoryOnClickHandler}
        />
        <NounInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={<Trans>Etherscan</Trans>}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default NounInfoCard;
