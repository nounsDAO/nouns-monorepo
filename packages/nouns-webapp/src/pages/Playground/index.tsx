import { Container, Col, Button, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import classes from './Playground.module.css';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { INounSeed } from '../../wrappers/nounToken';
import config from '../../config';
import Noun from '../../components/Noun';
import { NounsDescriptorABI, NounsSeederABI } from '@nouns/contracts';

interface Trait {
  title: string;
  count: number;
}

const Playground = () => {
  const [svgs, setSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();

  const fetchesOnTap = 8;
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
    for (let i = 0; i < fetchesOnTap; i++) {
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

  useEffect(() => {
    if (!ethersUseDapp.library) return;

    const fetchPartsCount = async () => {
      const [backgroundCount, bodyCount, accessoryCount, headCount, glasssesCount] = [
        (await descriptor.backgroundCount()) as BigNumber,
        (await descriptor.bodyCount()) as BigNumber,
        (await descriptor.accessoryCount()) as BigNumber,
        (await descriptor.headCount()) as BigNumber,
        (await descriptor.glassesCount()) as BigNumber,
      ];

      setTraits([
        { title: 'Head', count: headCount.toNumber() },
        { title: 'Glasses', count: glasssesCount.toNumber() },
        { title: 'Body', count: bodyCount.toNumber() },
        { title: 'Accessory', count: accessoryCount.toNumber() },
        { title: 'Background', count: backgroundCount.toNumber() },
      ]);
    };

    fetchPartsCount();
  }, [ethersUseDapp.library]);

  const options = (numOptions: number) => {
    return Array.from(Array(numOptions)).map((_, index) => {
      return <Dropdown.Item key={index}>{`Option #${index + 1}`} </Dropdown.Item>;
    });
  };

  return (
    <Container>
      <Row>
        <Col lg={10} className={classes.headerRow}>
          <span>Explore</span>
          <h1>Playground</h1>
          <p>
            The playground was built using the Nouns protocol. Each Noun's traits are generated
            using the NounsSeeder contract. Using the seed, the Noun is then rendered using the
            NounsDescriptor contract.
          </p>
        </Col>

        <Col lg={3}>
          <Button onClick={fetchSVG} className={classes.generateBtn}>
            GENERATE NOUNS
          </Button>
          {traits &&
            traits.map(trait => {
              return (
                <DropdownButton
                  id="dropdown-basic-button"
                  title={trait.title}
                  className={classes.dropdownBtn}
                >
                  {options(trait.count)}
                </DropdownButton>
              );
            })}
        </Col>
        <Col lg={9}>
          <Row>
            {svgs &&
              svgs.map((svg, i) => {
                return (
                  <Col xs={4} lg={3} key={i}>
                    <Noun
                      imgPath={`data:image/svg+xml;base64,${svg}`}
                      alt="noun"
                      className={classes.nounImg}
                    />
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Playground;
