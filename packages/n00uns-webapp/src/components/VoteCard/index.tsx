import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Proposal } from '../../wrappers/n00unsDao';
import N00unImageVoteTable from '../N00unImageVoteTable';
import VoteProgressBar from '../VoteProgressBar';
import classes from './VoteCard.module.css';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import DelegateGroupedN00unImageVoteTable from '../DelegateGroupedN00unImageVoteTable';
import { useEthers } from '@usedapp/core';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import clsx from 'clsx';
import { ensCacheKey } from '../../utils/ensLookup';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { lookupNNSOrENS } from '../../utils/lookupNNSOrENS';
import { Web3Provider } from '@ethersproject/providers';

export enum VoteCardVariant {
  FOR,
  AGAINST,
  ABSTAIN,
}

interface VoteCardProps {
  proposal: Proposal;
  percentage: number;
  n00unIds: Array<string>;
  variant: VoteCardVariant;
  delegateView: boolean;
  delegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; n00unsRepresented: string[] }[]
    | undefined;
}

const VoteCard: React.FC<VoteCardProps> = props => {
  const { proposal, percentage, n00unIds, variant, delegateView, delegateGroupedVoteData } = props;

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

  const { library } = useEthers();
  const [ensCached, setEnsCached] = useState(false);
  const locale = useActiveLocale();
  const filteredDelegateGroupedVoteData =
    delegateGroupedVoteData?.filter(v => v.supportDetailed === supportDetailedValue) ?? [];
  const isEnUS = locale === 'en-US';

  // Pre-fetch ENS  of delegates (with 30min TTL)
  // This makes hover cards load more smoothly
  useEffect(() => {
    if (!delegateGroupedVoteData || !library || ensCached) {
      return;
    }

    delegateGroupedVoteData.forEach((delegateInfo: { delegate: string }) => {
      if (localStorage.getItem(ensCacheKey(delegateInfo.delegate))) {
        return;
      }

      lookupNNSOrENS(new Web3Provider((library as any)), delegateInfo.delegate)
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
  }, [library, ensCached, delegateGroupedVoteData]);

  return (
    <Col lg={4} className={classes.wrapper}>
      <Card className={classes.voteCountCard}>
        <Card.Body className="p-2">
          <Card.Text className="py-2 m-0">
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

          <Card.Text className={clsx('py-2 m-0', classes.mobileVoteCountWrapper)}>
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
          <Row className={classes.n00unProfilePics}>
            {delegateView ? (
              <DelegateGroupedN00unImageVoteTable
                filteredDelegateGroupedVoteData={filteredDelegateGroupedVoteData}
                propId={parseInt(proposal.id || '0')}
                proposalCreationBlock={proposal.createdBlock}
              />
            ) : (
              <N00unImageVoteTable n00unIds={n00unIds} propId={parseInt(proposal.id || '0')} />
            )}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VoteCard;
