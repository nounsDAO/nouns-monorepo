import { Container, Col, Button, Row, Dropdown } from 'react-bootstrap';
import classes from './Playground.module.css';
import React, { useEffect, useState } from 'react';
import { ImageData, getNounData, getRandomNounSeed } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import Noun from '../../components/Noun';
import NounModal from './NounModal';

interface Trait {
  title: string;
  traitNames: string[];
}

const parseTraitName = (partName: string): string =>
  capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1));

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const Playground: React.FC = () => {
  const [nounSvgs, setNounSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);
  const [displayNoun, setDisplayNoun] = useState<boolean>(false);
  const [indexOfNounToDisplay, setIndexOfNounToDisplay] = useState<number>();

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

  const selectedOptionForTrait = (traitTitle: string): string => {
    if (!traits || !modSeed) return 'Random';
    const trait = traits.find(trait => trait.title === traitTitle)?.traitNames[modSeed[traitTitle]];
    return trait ? parseTraitName(trait) : 'Random';
  };

  return (
    <>
      {displayNoun && indexOfNounToDisplay !== undefined && nounSvgs && (
        <NounModal
          onDismiss={() => {
            setDisplayNoun(false);
          }}
          imgSrc={nounSvgs[indexOfNounToDisplay]}
        />
      )}

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
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      key={index}
                      className={classes.dropdownBtn}
                    >
                      <div className={classes.dropdownBtnTextContainer}>
                        <span className={classes.header}>{capitalizeFirstLetter(trait.title)}</span>
                        <span className={classes.selection}>
                          {selectedOptionForTrait(trait.title)}
                        </span>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className={classes.dropdownMenuBtn}>
                      {traitOptionButtons({ title: trait.title, traitNames: trait.traitNames })}
                    </Dropdown.Menu>
                  </Dropdown>
                );
              })}
            <p className={classes.nounYearsFooter}>
              You've generated {nounSvgs ? (nounSvgs.length / 365).toFixed(2) : '0'} years worth of
              Nouns
            </p>
          </Col>
          <Col lg={9}>
            <Row>
              {nounSvgs &&
                nounSvgs.map((svg, i) => {
                  return (
                    <Col xs={4} lg={3} key={i}>
                      <div
                        onClick={() => {
                          setIndexOfNounToDisplay(i);
                          setDisplayNoun(true);
                        }}
                      >
                        <Noun imgPath={svg} alt="noun" className={classes.nounImg} />
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Playground;
