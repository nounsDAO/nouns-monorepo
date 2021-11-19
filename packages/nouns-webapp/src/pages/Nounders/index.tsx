import React from 'react';
import classes from './NoundersPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import pfp4156 from '../../assets/nounder-pfps/4156.png';
import pfp9999 from '../../assets/nounder-pfps/9999.png';
import pfpCryptoseneca from '../../assets/nounder-pfps/cryptoseneca.png';
import pfpDevcarrot from '../../assets/nounder-pfps/devcarrot.png';
import pfpDom from '../../assets/nounder-pfps/dom.png';
import pfpKai from '../../assets/nounder-pfps/kai.png';
import pfpSolimander from '../../assets/nounder-pfps/solimander.png';
import pfpGremplin from '../../assets/nounder-pfps/gremplin.png';
import pfpTimpers from '../../assets/nounder-pfps/timpers.png';
import pfpVapeape from '../../assets/nounder-pfps/vapeape.png';

const bios = [
  {
    name: '4156',
    image: pfp4156,
    description: undefined,
    handle: 'punk4156',
  },
  {
    name: 'cryptoseneca',
    image: pfpCryptoseneca,
    description: undefined,
    handle: 'cryptoseneca',
  },
  {
    name: 'Kai@eboy',
    image: pfpKai,
    description: undefined,
    handle: 'eBoyArts',
  },
  {
    name: 'dom',
    image: pfpDom,
    description: undefined,
    handle: 'dhof',
  },
  {
    name: 'vapeape',
    image: pfpVapeape,
    description: undefined,
    handle: 'punk4464',
  },
  {
    name: 'gremplin',
    image: pfpGremplin,
    description: undefined,
    handle: 'supergremplin',
  },
  {
    name: 'solimader',
    image: pfpSolimander,
    description: undefined,
    handle: '',
  },
  {
    name: 'devcarrot',
    image: pfpDevcarrot,
    description: undefined,
    handle: 'carrot_init',
  },
  {
    name: 'timpers',
    image: pfpTimpers,
    description: undefined,
    handle: 'TimpersHD',
  },
  {
    name: '9999',
    image: pfp9999,
    description: undefined,
    handle: 'lastpunk9999',
  },
];

const BioCard: React.FC<{
  name: string;
  description?: string | undefined;
  image: string;
  handle?: string | undefined;
}> = props => {
  const { name, description, image, handle } = props;
  return (
    <>
      <Card.Img variant="top" src={image} />
      <Card.Title>
        {handle && (
          <a href={`https://twitter.com/${handle}`} target="_blank" rel="noreferrer">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={classes.twitterIcon}
              data-v-6cab4e66=""
            >
              <path
                d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                data-v-6cab4e66=""
              ></path>
            </svg>
            {name}
          </a>
        )}

        {!handle && name}
      </Card.Title>
      {description && <Card.Text>{description}</Card.Text>}
    </>
  );
};

const BioCards: React.FC<{ min: number; max: number }> = props => {
  const { min, max } = props;
  return (
    <>
      {bios.slice(min, max).map(bio => (
        <Col xs={5} md={3} lg={3} className={classes.bioGroup}>
          <BioCard {...bio} />
        </Col>
      ))}
    </>
  );
};

const NoundersPage = () => {
  return (
    <Section fullWidth={true} className={classes.noundersPage}>
      <Col lg={{ span: 6, offset: 3 }}>
        <h2 style={{ marginBottom: '2rem' }}>The Nounders</h2>
        <h3 style={{ marginBottom: '2rem' }}>3.5 artists, 6.5 technologists</h3>
        <Row style={{ marginBottom: '0rem' }}>
          <BioCards min={0} max={5} />
          <BioCards min={5} max={10} />
        </Row>
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

export default NoundersPage;
