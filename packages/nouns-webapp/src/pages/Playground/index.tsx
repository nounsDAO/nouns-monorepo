import { Col, Image, Button, Row } from 'react-bootstrap';
import { buildNounSVG } from '../../utils/buildNounSVG';
import { EncodedLayers } from '@nouns/contracts';
import Section from '../../layout/Section';
import classes from './Playground.module.css';
import { useState } from 'react';

const { bgcolors, partcolors, parts } = EncodedLayers;
const [bodies, accessories, heads, glasses] = parts;

const getRandom = <T extends unknown>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomNoun = () => {
  const backgroundColor = getRandom(bgcolors);
  const selectedParts = [
    getRandom(bodies),
    getRandom(accessories),
    getRandom(heads),
    getRandom(glasses),
  ];
  return buildNounSVG(selectedParts, partcolors, backgroundColor);
};

const Playground = () => {
  const [svgs, setSvgs] = useState<string[]>();
  const fetchSVG = async () => {
    for (let i = 0; i < 10; i++) {
      const base64SVG = btoa(getRandomNoun());
      setSvgs(prev => {
        return prev ? [base64SVG, ...prev] : [base64SVG];
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
