import React from 'react';
import classes from './Feats.module.css';
import Section from '../../layout/Section';
import { Col, Row } from 'react-bootstrap';

const FeatsPage = () => {
  return (
    <Section fullWidth={true} className={classes.noundersPage}>
      <Col lg={{ span: 6, offset: 3 }}>
        <h2 style={{ marginBottom: '2rem' }}>The Chiliagons</h2>
        <h3 style={{ marginBottom: '2rem' }}>3.5 artists, 6.5 technologists</h3>
        
        <h3>Nounders' Reward</h3>
        <p style={{ textAlign: 'justify' }}>
          All Noun auction proceeds are sent to the Nouns DAO. For this reason, we, the project's
          founders (‘Nounders’) have chosen to compensate ourselves with Nouns. Every 10th noun for
          the first 5 years of the project will be sent to our multisig (5/10), where it will be
          vested and distributed to individual Nounders.
        </p>
        <p style={{ textAlign: 'justify' }}>
          The Nounders reward is intended as compensation for our pre and post-launch contributions
          to the project, and to help us participate meaningfully in governance as the project
          matures. Since there are 10 Nounders, after 5 years each Nounder could receive up to 1% of
          the Noun supply.
        </p>
      </Col>
    </Section>
  );
};

export default FeatsPage;
