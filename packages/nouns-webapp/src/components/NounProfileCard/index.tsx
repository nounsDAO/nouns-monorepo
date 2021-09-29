import { Row } from 'react-bootstrap';
import { StandaloneNounCircleImg } from '../../components/StandaloneNoun';
import classes from './NounProfileCard.module.css';
import { BigNumber } from 'ethers';
import React from 'react';
import ShortAddress from '../ShortAddress';
import { LoadingNoun } from '../Noun';
import { useQuery } from '@apollo/client';
import { nounQuery } from '../../wrappers/subgraph';
import NounProfileCardBirthday from '../NounProfileCardBirthday';

interface NounProfileCardProps {
  nounId: number;
}

const NounProfileCard: React.FC<NounProfileCardProps> = props => {
  const { nounId } = props;

  const { loading, error, data } = useQuery(nounQuery(nounId.toString()));

  if (loading) {
    return <LoadingNoun />;
  } else if (error) {
    return <div>Failed to fetch noun info</div>;
  }

  return (
    <div>
      <Row>
        <StandaloneNounCircleImg nounId={BigNumber.from(nounId)} />
      </Row>
      <Row>
        <h1 className={classes.heading}>Noun {nounId}</h1>
      </Row>
      <Row>
        <NounProfileCardBirthday nounId={nounId} />
      </Row>
      <Row>
        <p style={{ fontWeight: 'bold' }}>Current Caretaker:</p>
      </Row>
      <Row>
        <h2 className={classes.subHeading}>
          <ShortAddress address={data && data.noun.owner.id} />
        </h2>
      </Row>
    </div>
  );
};

export default NounProfileCard;
