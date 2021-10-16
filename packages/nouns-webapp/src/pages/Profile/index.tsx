import { BigNumber } from "ethers";
import React from "react";
import { Row, Col, Container, Image , Button} from "react-bootstrap";
import { StandaloneNounWithSeed } from "../../components/StandaloneNoun";
import { useAppDispatch } from "../../hooks";
import { setUseGreyBackground } from '../../state/slices/application';
import { INounSeed } from "../../wrappers/nounToken";

import classes from './Profile.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';
import _HeartIcon from '../../assets/icons/Heart.svg';
import _ClockIcon from '../../assets/icons/Clock.svg';
import _LinkIcon from '../../assets/icons/Link.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoCard from "../../components/NounInfoCard";
import ProfileActivityFeed from "../../components/ProfileActivityFeed";


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

    return (
        <>
            <Container fluid="lg">
                <Row>
                    <Col lg={{ span: 6 }} className={classes.nounProfilePictureCol}>
                        {nounContent}
                    </Col>
                    <Col lg={{ span: 6 }}>
                      <NounInfoCard nounId={nounId} /> 
                    </Col>
                </Row>
            </Container>
            <ProfileActivityFeed nounId={nounId} />
        </>
    );
};

export default ProfilePage;