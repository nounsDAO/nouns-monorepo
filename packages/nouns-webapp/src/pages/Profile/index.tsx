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

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setUseGreyBackground(seed.background === 0));
  };

  const nounContent = (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed nounId={BigNumber.from(nounId)} onLoadSeed={loadedNounHandler} />
    </div>
  );

  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);

  return (
    <div className={classes.nounProfileWrapper}>
      <Container fluid={true} className={useGreyBg ? classes.greyBg : classes.beigeBg}>
        <Container fluid="lg">
          <Row>
            <Col lg={{ span: 6 }} className={classes.nounProfilePictureCol}>
              {nounContent}
            </Col>
            <Col lg={{ span: 6 }} className={classes.nounProfileInfo}>
              <NounInfoCard nounId={nounId} />
            </Col>
          </Row>
        </Container>
      </Container>
      <ProfileActivityFeed nounId={nounId} />
    </div>
  );
};

export default ProfilePage;
