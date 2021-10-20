import { Container, Col, Button, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import classes from './Playground.module.css';
import { useEffect, useState } from 'react';
import { ImageData, getNounData, getRandomNounSeed } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import React from 'react';
import Noun from '../../components/Noun';

interface Trait {
  title: string;
  count: number;
}

const Playground = () => {
  const [nounSvgs, setNounSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();

  const generateNounSvg = React.useCallback(() => {
    const seed = { ...getRandomNounSeed(), ...modSeed };
    const { parts, background } = getNounData(seed);
    const image = `data:image/svg+xml;base64,${btoa(
      buildSVG(parts, ImageData.palette, background),
    )}`;
    setNounSvgs(prev => {
      return prev ? [image, ...prev] : [image];
    });
  }, [modSeed]);

  const attributeButtonHandler = (trait: string, attributeNum: number) => {
    setModSeed(prev => {
      // -1 attributeNum = random
      if (attributeNum < 0) {
        let state = { ...prev };
        delete state[trait];
        return state;
      }

      return {
        ...prev,
        [trait]: attributeNum,
      };
    });
  };

  useEffect(() => {
    const traitNames = ['background', 'body', 'accessory', 'head', 'glasses'];
    const traitCounts = [
      ImageData.bgcolors.length,
      ...Object.values(ImageData.images).map(i => {
        return i.length;
      }),
    ];
    setTraits(
      traitNames.map((value, index) => {
        return {
          title: value,
          count: traitCounts[index],
        };
      }),
    );

    generateNounSvg();
  }, [generateNounSvg]);

  const attributeOptionButtons = (trait: Trait) => {
    return Array.from(Array(trait.count + 1)).map((_, index) => {
      return (
        <Dropdown.Item
          key={index}
          onClick={() => {
            attributeButtonHandler(trait.title, index - 1);
          }}
        >
          {index === 0 ? `Random` : `Option #${index}`}
        </Dropdown.Item>
      );
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
          <Button onClick={generateNounSvg} className={classes.generateBtn}>
            GENERATE NOUNS
          </Button>
          {traits &&
            traits.map((trait, index) => {
              return (
                <DropdownButton
                  key={index}
                  id="dropdown-basic-button"
                  title={trait.title}
                  className={classes.dropdownBtn}
                >
                  {attributeOptionButtons({ title: trait.title, count: trait.count })}
                </DropdownButton>
              );
            })}
        </Col>
        <Col lg={9}>
          <Row>
            {nounSvgs &&
              nounSvgs.map((svg, i) => {
                return (
                  <Col xs={4} lg={3} key={i}>
                    <Noun imgPath={svg} alt="noun" className={classes.nounImg} />
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
