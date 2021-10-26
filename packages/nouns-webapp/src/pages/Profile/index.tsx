import { BigNumber } from 'ethers';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../../components/StandaloneNoun';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setUseGreyBackground } from '../../state/slices/application';
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

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setUseGreyBackground(seed.background === 0));
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
      <Container fluid="lg">
        <Row>
          <Col lg={6}>{nounContent}</Col>
          <Col lg={6} className={classes.nounProfileInfo}>
            <NounInfoCard nounId={nounIdForDisplay} />
          </Col>
        </Row>
      </Container>
      <ProfileActivityFeed nounId={nounIdForDisplay} />
    </>
  );
};

export default ProfilePage;
