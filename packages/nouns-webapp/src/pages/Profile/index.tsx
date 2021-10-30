import { BigNumber } from 'ethers';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../../components/StandaloneNoun';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setStateBackgroundColor } from '../../state/slices/application';
import { grey, beige } from '../../utils/nounBgColors';
import { INounSeed } from '../../wrappers/nounToken';

import classes from './Profile.module.css';

import NounInfoCard from '../../components/NounInfoCard';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';

interface ProfilePageProps {
  nounId: number;
}

const ProfilePage: React.FC<ProfilePageProps> = props => {
  const { nounId } = props;

  const dispatch = useAppDispatch();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  if (!lastAuctionNounId) {
    return <></>;
  }

  const nounIdForDisplay = Math.min(nounId, lastAuctionNounId);

  const nounContent = (
    <StandaloneNounWithSeed
      nounId={BigNumber.from(nounIdForDisplay)}
      onLoadSeed={loadedNounHandler}
      shouldLinkToProfile={false}
    />
  );

  return (
    <>
      <div style={{ backgroundColor: stateBgColor }}>
        <Container>
          <Row>
            <Col lg={6}>{nounContent}</Col>
            <Col lg={6} className={classes.nounProfileInfo}>
              <NounInfoCard nounId={nounIdForDisplay} />
            </Col>
          </Row>
        </Container>
      </div>
      <ProfileActivityFeed nounId={nounIdForDisplay} />
    </>
  );
};

export default ProfilePage;
