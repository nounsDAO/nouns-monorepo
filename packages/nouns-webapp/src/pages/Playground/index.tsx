import { Col, Image, Button, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './Playground.module.css';
import { useEthers } from '@usedapp/core';
import { useState } from 'react';
import { ethers } from 'ethers';
import config from '../../config';
import { NounsDescriptorABI, NounsSeederABI } from '@nouns/contracts';

const Playground = () => {
  const [svgs, setSvgs] = useState<string[]>();

  const ethersUseDapp = useEthers();
  const descriptor = new ethers.Contract(
    config.nounsDescriptorAddress,
    NounsDescriptorABI,
    ethersUseDapp.library,
  );
  const seeder = new ethers.Contract(
    config.nounsSeederAddress,
    NounsSeederABI,
    ethersUseDapp.library,
  );

  const fetchSVG = async () => {
    for (let i = 0; i < 10; i++) {
      const seed = await seeder.generateSeed(
        Math.floor(Math.random() * 10000000000),
        config.nounsDescriptorAddress,
      );
      const svg = await descriptor.generateSVGImage(seed);
      setSvgs(prev => {
        return prev ? [svg, ...prev] : [svg];
      });
    }
  };

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={6}>
        <h1>Playground</h1>
        <p>
          The playground was built using the Nouns protocol. Each Noun's traits are generated using
          the NounsSeeder contract. Using the seed, the Noun is then rendered using the
          NounsDescriptor contract.
          <br />
          <br />
          Take a look at the docs to learn more!
        </p>
      </Col>
      <Col lg={{ span: 5, offset: 1 }} className={classes.generateSection}>
        <Button onClick={fetchSVG} className={classes.generateBtn}>
          GENERATE NOUNS
        </Button>
      </Col>

      <Row>
        {svgs &&
          svgs.map(svg => {
            return (
              <Col xs={6} xl={3}>
                <div className={classes.nounWrapper}>
                  <Image
                    src={`data:image/svg+xml;base64,${svg}`}
                    alt="noun"
                    className={classes.noun}
                  />
                  <Button className={classes.saveNounBtn}>RCSA</Button>
                </div>
              </Col>
            );
          })}
      </Row>
    </Section>
  );
};
export default Playground;
