import React from 'react';
import classes from './Directory.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { BigNumber } from '@ethersproject/bignumber';
import StandaloneNoun from '../../components/StandaloneNoun';
import {Link} from 'react-router-dom';

const Directory = () => {
  const auctions = useAppSelector(state =>
    state.auction.activeAuction
      ? new Array(BigNumber.from(state.auction.activeAuction.nounId).toNumber() + 1)
          .fill(0)
          .map((_, i) => i)
      : [],
  );

  return (
    <Section bgColor="transparent" fullWidth={true} className={classes.directory}>
      <Col lg={{ span: 9, offset: 2 }}>
        <h2 style={{ marginBottom: '2rem' }}>Nouns Directory</h2>
        <div className={classes.directoryGrid}>
          {auctions.map((auction: number, i: number) => (
            <div key={i} className={classes.nounEntry}>
              <Link to={`/noun/${i}`} className={classes.nounTitle}>
                <h3 className={classes.nounTitle}>Noun {i}</h3>
              </Link>
              <StandaloneNoun nounId={BigNumber.from(i)} />
            </div>
          ))}
        </div>
      </Col>
    </Section>
  );
};

export default Directory;
