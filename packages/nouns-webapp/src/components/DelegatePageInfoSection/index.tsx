import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import React from 'react';
import { Col } from 'react-bootstrap';
import { getProposalsByProposer } from '../../wrappers/subgraph';
import BrandSpinner from '../BrandSpinner';
import DelegatePageNounCardContentWrapper from '../DelegatePageNounCardContentWrapper';
import NounsCard from '../NounsCard';
import classes from './DelegatePageInfoSection.module.css';

interface DelegatePageInfoSectionProps {
  votes: number;
  percentOfVotePower: string;
  delegateAddress: string;
}

const DelegatePageInfoSection: React.FC<DelegatePageInfoSectionProps> = props => {
  const { votes, percentOfVotePower, delegateAddress } = props;

  const { data, loading, error } = useQuery(getProposalsByProposer(delegateAddress));

  if (loading) {
    return (
      <Col lg={10}>
        <div className={classes.loading}>
          <BrandSpinner />
        </div>
      </Col>
    );
  }

  if (error) {
    return <>Failed to fetch</>;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <NounsCard>
          <DelegatePageNounCardContentWrapper
            primaryText={<Trans>Votes</Trans>}
            secondaryText={votes}
          />
        </NounsCard>
      </div>

      <div className={classes.card}>
        <NounsCard>
          <DelegatePageNounCardContentWrapper
            primaryText={<Trans>Props created</Trans>}
            secondaryText={data.proposals.length}
          />
        </NounsCard>
      </div>

      <div className={clsx(classes.card, classes.lastCard)}>
        <NounsCard>
          <DelegatePageNounCardContentWrapper
            primaryText={<Trans>% of voting power</Trans>}
            secondaryText={<>{percentOfVotePower}%</>}
          />
        </NounsCard>
      </div>
    </div>
  );
};

export default DelegatePageInfoSection;
