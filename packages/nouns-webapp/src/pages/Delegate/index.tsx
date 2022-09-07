import { useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import BrandSpinner from '../../components/BrandSpinner';
import DelegateActivityFeed from '../../components/DelegateActivityFeed';
import DelegatePageInfoSection from '../../components/DelegatePageInfoSection';
import DelegateTitle from '../../components/DelegateTitle';
import { useAppSelector } from '../../hooks';
import { useResolveENSToAddress } from '../../hooks/useResolveENSToAddress';
import Section from '../../layout/Section';
import { richDelegateInfo } from '../../wrappers/subgraph';
import classes from './Delegate.module.css';

const DelegatePage = ({
  match: {
    params: { addressOrENS },
  },
}: RouteComponentProps<{ addressOrENS?: string }>) => {
  const resolvedENS = useResolveENSToAddress(addressOrENS?.trim() ?? '');

  const address = ethers.utils.isAddress(addressOrENS ?? '') ? addressOrENS : resolvedENS;

  const { data, loading, error } = useQuery(richDelegateInfo(address?.toLowerCase() ?? ''));
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  if (error) {
    return <>Failed to fetch </>;
  }

  if (loading) {
    return (
      <Section fullWidth={false} className={classes.delegatePage}>
        <Col lg={10} className={classes.wrapper}>
          <div className={classes.loading}>
            <BrandSpinner />
          </div>
        </Col>
      </Section>
    );
  }

  const isDelegate = data && data.delegate;
  return (
    <Section fullWidth={false} className={classes.delegatePage}>
      <Col lg={10} className={classes.wrapper}>
        <DelegateTitle
          delegateAddress={address ?? ''}
          nounsRepresented={
            isDelegate
              ? data.delegate.nounsRepresented.map((noun: { id: string }) => {
                  return noun.id;
                })
              : []
          }
        />
      </Col>

      <Col lg={10} className={classes.wrapper}>
        <DelegatePageInfoSection
          votes={isDelegate ? data.delegate.nounsRepresented.length : 0}
          delegateAddress={address ?? ''}
          percentOfVotePower={
            isDelegate
              ? (
                  100.0 *
                  (data.delegate.nounsRepresented.length / (lastAuctionNounId ?? 1))
                ).toFixed(2)
              : '0'
          }
        />
      </Col>

      <div className={classes.activityWrapper}>
        <DelegateActivityFeed votes={data && data.delegate ? data.delegate.votes : []} />
      </div>
    </Section>
  );
};

export default DelegatePage;
