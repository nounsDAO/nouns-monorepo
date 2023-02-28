import { Button, Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import classes from './Winner.module.css';
import ShortAddress from '../ShortAddress';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { Trans } from '@lingui/macro';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import React from 'react';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import Tooltip from '../Tooltip';

interface WinnerProps {
  winner: string;
  isNounders?: boolean;
}

const Winner: React.FC<WinnerProps> = props => {
  const { winner, isNounders } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const isMobile = isMobileScreen();

  const isWinnerYou =
    activeAccount !== undefined && activeAccount.toLocaleLowerCase() === winner.toLocaleLowerCase();

  const activeLocale = useActiveLocale();

  const nonNounderNounContent = isWinnerYou ? (
    <Row className={classes.youSection}>
      <Col lg={activeLocale === 'ja-JP' ? 8 : 4} className={classes.youCopy}>
        <h2
          className={classes.winnerContent}
          style={{
            color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
          }}
        >
          <Trans>You</Trans>
        </h2>
      </Col>
      {/*{!isMobile && (*/}
      {/*  <Col>*/}
      {/*    <a*/}
      {/*      href="https://nouns.center/nouners"*/}
      {/*      target="_blank"*/}
      {/*      rel="noreferrer noopener"*/}
      {/*      className={classes.verifyLink}*/}
      {/*    >*/}
      {/*      <Button className={classes.verifyButton}>*/}
      {/*        <Trans>What now?</Trans>*/}
      {/*      </Button>*/}
      {/*    </a>*/}
      {/*  </Col>*/}
      {/*)}*/}
    </Row>
  ) : (
    <ShortAddress size={40} address={winner} avatar={true} />
  );

  const nounderNounContent = (
    <a
      href={buildEtherscanAddressLink('nounders.eth')}
      target={'_blank'}
      rel="noreferrer"
      className={classes.link}
    >
      <Tooltip
        tip="View on Etherscan"
        tooltipContent={(tip: string) => {
          return <Trans>View on Etherscan</Trans>;
        }}
        id="holder-etherscan-tooltip"
      >
        nounders.eth
      </Tooltip>
    </a>
  );

  return (
    <>
      <Row className={clsx(classes.wrapper, classes.section)}>
        <Col xs={1} lg={12} className={classes.leftCol}>
          <h4
            style={{
              color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
            }}
            className={classes.winnerCopy}
          >
            <Trans>Winner</Trans>
          </h4>
        </Col>
        <Col xs="auto" lg={12}>
          <h2
            className={classes.winnerContent}
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            {isNounders ? nounderNounContent : nonNounderNounContent}
          </h2>
        </Col>
      </Row>
      {/*{isWinnerYou && isMobile && (*/}
      {/*  <Row>*/}
      {/*    <a*/}
      {/*      href="https://nouns.center/nouners"*/}
      {/*      target="_blank"*/}
      {/*      rel="noreferrer noopener"*/}
      {/*      className={classes.verifyLink}*/}
      {/*    >*/}
      {/*      <Button className={classes.verifyButton}>*/}
      {/*        <Trans>What now?</Trans>*/}
      {/*      </Button>*/}
      {/*    </a>*/}
      {/*  </Row>*/}
      {/*)}*/}
    </>
  );
};

export default Winner;
