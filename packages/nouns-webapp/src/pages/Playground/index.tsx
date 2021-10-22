import { Container, Col, Button, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import classes from './Playground.module.css';
import { useEffect, useState } from 'react';
import { ImageData, getNounData, getRandomNounSeed } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import React from 'react';
import Noun from '../../components/Noun';

interface Trait {
  title: string;
  traitNames: string[];
}

const parseTraitName = (partName: string): string => partName.substring(partName.indexOf('-') + 1);

const Playground = () => {
  const [nounSvgs, setNounSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);

  const generateNounSvg = React.useCallback(
    (amount: number = 1) => {
      for (let i = 0; i < amount; i++) {
        const seed = { ...getRandomNounSeed(), ...modSeed };
        const { parts, background } = getNounData(seed);
        const image = `data:image/svg+xml;base64,${btoa(
          buildSVG(parts, ImageData.palette, background),
        )}`;
        setNounSvgs(prev => {
          return prev ? [image, ...prev] : [image];
        });
      }
    },
    [modSeed],
  );

  const traitButtonHandler = (trait: string, traitIndex: number) => {
    setModSeed(prev => {
      // -1 traitIndex = random
      if (traitIndex < 0) {
        let state = { ...prev };
        delete state[trait];
        return state;
      }

      return {
        ...prev,
        [trait]: traitIndex,
      };
    });
  };

  useEffect(() => {
    const traitTitles = ['background', 'body', 'accessory', 'head', 'glasses'];
    const traitNames = [
      ['cool', 'warm'],
      ...Object.values(ImageData.images).map(i => {
        return i.map(imageData => imageData.filename);
      }),
    ];
    setTraits(
      traitTitles.map((value, index) => {
        return {
          title: value,
          traitNames: traitNames[index],
        };
      }),
    );

    if (initLoad) {
      generateNounSvg(8);
      setInitLoad(false);
    }
  }, [generateNounSvg, initLoad]);

  const traitOptionButtons = (trait: Trait) => {
    return Array.from(Array(trait.traitNames.length + 1)).map((_, index) => {
      return (
        <Dropdown.Item
          key={index}
          onClick={() => {
            traitButtonHandler(trait.title, index - 1);
          }}
          className={classes.dropdownItemLink}
        >
          {index === 0 ? `Random` : parseTraitName(trait.traitNames[index - 1])}
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
      </Row>
      <Row>
        <Col lg={3}>
          <Button
            onClick={() => {
              generateNounSvg();
            }}
            className={classes.generateBtn}
          >
            Generate Nouns
          </Button>
          {traits &&
            traits.map((trait, index) => {
              return (
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" key={index} className={classes.dropdownBtn}>
                    <div className={classes.dropdownBtnTextContainer}>
                      <span className={classes.header}>{trait.title}</span>
                      <span className={classes.selection}>Random</span>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={classes.dropdownMenuBtn}>
                    {traitOptionButtons({ title: trait.title, traitNames: trait.traitNames })}
                  </Dropdown.Menu>
                </Dropdown>
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
