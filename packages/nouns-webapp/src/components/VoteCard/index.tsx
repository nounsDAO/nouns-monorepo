import React, { useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Card, Col, Row } from 'react-bootstrap';
import { usePublicClient } from 'wagmi';

import NounImageVoteTable from '@/components/NounImageVoteTable';
import VoteProgressBar from '@/components/VoteProgressBar';
import { useActiveLocale } from '@/hooks/useActivateLocale';
import { ensCacheKey } from '@/utils/ensLookup';
import { lookupNNSOrENS } from '@/utils/lookupNNSOrENS';
import { Address } from '@/utils/types';
import { Proposal } from '@/wrappers/nounsDao';

import DelegateGroupedNounImageVoteTable from '../DelegateGroupedNounImageVoteTable';

import classes from './VoteCard.module.css';

import responsiveUiUtilsClasses from '@/utils/ResponsiveUIUtils.module.css';

export enum VoteCardVariant {
  FOR,
  AGAINST,
  ABSTAIN,
}

interface VoteCardProps {
  proposal: Proposal;
  percentage: number;
  nounIds: Array<string>;
  variant: VoteCardVariant;
  delegateView: boolean;
  delegateGroupedVoteData:
    | { delegate: Address; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
}

const VoteCard: React.FC<VoteCardProps> = props => {
  const { proposal, percentage, nounIds, variant, delegateView, delegateGroupedVoteData } = props;

  let titleClass;
  let titleCopy;
  let voteCount;
  let supportDetailedValue: 0 | 1 | 2;
  switch (variant) {
    case VoteCardVariant.FOR:
      titleClass = classes.for;
      titleCopy = <Trans>For</Trans>;
      voteCount = proposal.forCount;
      supportDetailedValue = 1;
      break;
    case VoteCardVariant.AGAINST:
      titleClass = classes.against;
      titleCopy = <Trans>Against</Trans>;
      voteCount = proposal.againstCount;
      supportDetailedValue = 0;
      break;
    default:
      titleClass = classes.abstain;
      titleCopy = <Trans>Abstain</Trans>;
      voteCount = proposal.abstainCount;
      supportDetailedValue = 2;
      break;
  }

  const publicClient = usePublicClient();
  const [ensCached, setEnsCached] = useState(false);
  const locale = useActiveLocale();
  const filteredDelegateGroupedVoteData =
    delegateGroupedVoteData?.filter(v => v.supportDetailed === supportDetailedValue) ?? [];
  const isEnUS = locale === 'en-US';

  // Pre-fetch ENS of delegates (with 30 min TTL)
  // This makes hover cards load more smoothly
  useEffect(() => {
    if (!delegateGroupedVoteData || !publicClient || ensCached) {
      return;
    }

    delegateGroupedVoteData.forEach((delegateInfo: { delegate: Address }) => {
      if (localStorage.getItem(ensCacheKey(delegateInfo.delegate))) {
        return;
      }

      lookupNNSOrENS(publicClient, delegateInfo.delegate)
        .then(name => {
          // Store data as mapping of address_Expiration => address or ENS
          if (name) {
            localStorage.setItem(
              ensCacheKey(delegateInfo.delegate),
              JSON.stringify({
                name,
                expires: Date.now() / 1000 + 30 * 60,
              }),
            );
          }
        })
        .catch(error => {
          console.log(`error resolving reverse ens lookup: `, error);
        });
    });
    setEnsCached(true);
  }, [publicClient, ensCached, delegateGroupedVoteData]);

  return (
    <Col lg={4} className={classes.wrapper}>
      <Card className={classes.voteCountCard}>
        <Card.Body className="p-2">
          <Card.Text className="m-0 py-2">
            <span
              className={`${
                isEnUS ? classes.voteCardHeaderTextEn : classes.voteCardHeaderTextNonEn
              } ${titleClass}`}
            >
              {titleCopy}
            </span>
            <span
              className={clsx(
                classes.voteCardVoteCount,
                responsiveUiUtilsClasses.desktopOnly,
                !isEnUS ? classes.smallerVoteCountText : '',
              )}
            >
              {delegateView ? (
                <>
                  {filteredDelegateGroupedVoteData.length === 1 ? (
                    <Trans>
                      {i18n.number(filteredDelegateGroupedVoteData.length)}{' '}
                      <span className={isEnUS ? classes.unitTextEn : classes.unitTextNonEn}>
                        Address
                      </span>
                    </Trans>
                  ) : (
                    <Trans>
                      {i18n.number(filteredDelegateGroupedVoteData.length)}{' '}
                      <span className={isEnUS ? classes.unitTextEn : classes.unitTextNonEn}>
                        Addresses
                      </span>
                    </Trans>
                  )}
                </>
              ) : (
                i18n.number(voteCount)
              )}
            </span>
          </Card.Text>

          <Card.Text className={clsx('m-0 py-2', classes.mobileVoteCountWrapper)}>
            <span className={classes.voteCardVoteCount}>
              {delegateView
                ? i18n.number(filteredDelegateGroupedVoteData.length)
                : i18n.number(voteCount)}
            </span>
            <span
              className={clsx(
                classes.voteCardVoteCount,
                isEnUS ? classes.unitTextEn : classes.unitTextNonEn,
              )}
            >
              {delegateView && <Trans>Addresses</Trans>}
            </span>
          </Card.Text>

          <VoteProgressBar variant={variant} percentage={percentage} />
          <Row className={classes.nounProfilePics}>
            {delegateView ? (
              <DelegateGroupedNounImageVoteTable
                filteredDelegateGroupedVoteData={filteredDelegateGroupedVoteData}
                propId={Number(proposal.id || '0')}
                proposalCreationBlock={proposal.createdBlock}
              />
            ) : (
              <NounImageVoteTable nounIds={nounIds} propId={Number(proposal.id || '0')} />
            )}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VoteCard;
