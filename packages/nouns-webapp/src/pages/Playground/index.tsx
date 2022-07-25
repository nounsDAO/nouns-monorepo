import {
  Container,
  Col,
  Button,
  Image,
  Row,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Popover,
  FormCheck,
} from 'react-bootstrap';
import classes from './Playground.module.css';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ImageData } from '@nouns/assets';
import { buildSVG, PNGCollectionEncoder } from '@nouns/sdk';
import { NOUNDRY_TRAIT_URL } from '../../config';
import Link from '../../components/Link';
import InfoIcon from '../../assets/icons/Info.svg';
import Noun from '../../components/Noun';
import NounModal from './NounModal';
import { PNG } from 'pngjs';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

enum Stage {
  PROPOSED = 'proposed',
  PROTOCOL = 'protocol',
  CUSTOM = 'custom',
}

interface TraitValue {
  name: string;
  stage: Stage;
  data: string;
}

enum TraitType {
  BACKGROUND = 'background',
  BODY = 'bodies',
  ACCESSORY = 'accessories',
  HEAD = 'heads',
  GLASSES = 'glasses',
}

interface Trait {
  type: TraitType;
  title: string;
  values: TraitValue[];
}

type Traits = Record<TraitType, Trait>;

interface PendingCustomTrait {
  data: string;
  filename: string;
}

interface PendingCustomTraits {
  type: TraitType;
  traits: PendingCustomTrait[];
}

const nounsProtocolLink = (
  <Link
    text={<Trans>Nouns Protocol</Trans>}
    url="https://www.notion.so/Noun-Protocol-32e4f0bf74fe433e927e2ea35e52a507"
    leavesPage={true}
  />
);

const noundryLink = (
  <Link
    text="Noundry"
    url="https://github.com/nounsDAO/noundry#contributing-traits"
    leavesPage={true}
  />
);

const traitTypeToTitle: Record<string, string> = {
  heads: 'head',
  glasses: 'glasses',
  bodies: 'body',
  accessories: 'accessory',
};

const parseTraitName = (partName: string): string =>
  capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1));

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const buildTraits = (images: typeof ImageData.images, stage: Stage, initial = {}) => {
  return Object.entries(images).reduce<Traits>((acc, [_type, values]) => {
    const type = _type as TraitType;
    acc[type] = {
      type,
      title: traitTypeToTitle[type],
      values: values.map(v => ({
        stage,
        name: v.filename,
        data: v.data,
      })),
    };
    return acc;
  }, initial as Traits);
};

const Playground: React.FC = () => {
  const [nounSvgs, setNounSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Traits>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);
  const [displayNoun, setDisplayNoun] = useState<boolean>(false);
  const [indexOfNounToDisplay, setIndexOfNounToDisplay] = useState<number>();
  const [selectIndexes, setSelectIndexes] = useState<Record<string, number>>({});
  const [proposedTraits, setProposedTraits] = useState<Traits>();
  const [includeProposedTraits, setIncludeProposedTraits] = useState(true); // TODO: Save user preference in localstorage
  const [pendingTraits, setPendingTraits] = useState<PendingCustomTraits>();
  const [arePendingTraitsValid, setPendingTraitsValid] = useState<boolean>();
  const [encoder, setEncoder] = useState(new PNGCollectionEncoder(ImageData.palette));

  const customTraitFileRef = useRef<HTMLInputElement>(null);

  const getRandom = (length: number) => Math.floor(Math.random() * length);

  const getRandomNounSeed = () => {
    const {
      bgcolors,
      images: { bodies, accessories, heads, glasses },
    } = ImageData;
    return {
      background: getRandom(traits?.background.values.length || bgcolors.length),
      body: getRandom(traits?.bodies.values.length || bodies.length),
      accessory: getRandom(traits?.accessories.values.length || accessories.length),
      head: getRandom(traits?.heads.values.length || heads.length),
      glasses: getRandom(traits?.glasses.values.length || glasses.length),
    };
  };

  const mergeAndSortTraits = React.useCallback((...traits: (Traits | undefined)[]) => {
    const merged = traits.reduce<Traits>((acc, item) => {
      Object.entries(item || {}).forEach(attr => {
        const [key, value] = attr as [TraitType, Trait];
        if (!acc[key] && value) {
          acc[key] = {
            type: value.type,
            title: value.title,
            values: [],
          };
        }
        if (acc[key] && value?.values) {
          acc[key].values = [...(acc[key].values || []), ...(value.values || [])];
        }
        return acc;
      });

      return acc;
    }, {} as Traits);
    return Object.values(TraitType).reduce<Traits>((acc, curr) => {
      acc[curr] = merged?.[curr];
      return acc;
    }, {} as Traits);
  }, []);

  const generateNounSvg = React.useCallback(
    (amount: number = 1) => {
      if (!traits) {
        return;
      }

      for (let i = 0; i < amount; i++) {
        const seed = { ...getRandomNounSeed(), ...modSeed };
        const background = traits.background.values[seed.background];
        const parts = [
          traits.bodies.values[seed.body],
          traits.accessories.values[seed.accessory],
          traits.heads.values[seed.head],
          traits.glasses.values[seed.glasses],
        ];

        const svg = buildSVG(parts, encoder.data.palette, background.data);
        setNounSvgs(prev => {
          return prev ? [svg, ...prev] : [svg];
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingTraits, traits, modSeed],
  );

  useEffect(() => {
    if (initLoad && traits) {
      generateNounSvg(8);
      setInitLoad(false);
    }
  }, [generateNounSvg, initLoad, traits]);

  useEffect(() => {
    const stage = Stage.PROTOCOL;
    const data = buildTraits(ImageData.images, stage, {
      background: {
        type: 'background',
        title: 'background',
        values: [
          {
            stage,
            name: 'cool',
            data: 'd5d7e1',
          },
          {
            stage,
            name: 'warm',
            data: 'e1d7d5',
          },
        ],
      },
    });

    // Always reset indexes to avoid shifting
    setSelectIndexes({});
    setModSeed(undefined);

    if (includeProposedTraits) {
      setTraits(mergeAndSortTraits(proposedTraits, data));
    } else {
      setTraits(data);
    }
  }, [mergeAndSortTraits, proposedTraits, includeProposedTraits]);

  useEffect(() => {
    const fetchAndStoreProposedTraits = async () => {
      try {
        const response = await fetch(NOUNDRY_TRAIT_URL);
        const data: typeof ImageData = await response.json();

        setEncoder(new PNGCollectionEncoder(data.palette));

        setProposedTraits(buildTraits(data.images, Stage.PROPOSED));
      } catch ({ message }) {
        console.log(`Failed to load proposed traits with error: ${message}.`);
      }
    };

    if (includeProposedTraits) {
      fetchAndStoreProposedTraits();
    }
  }, [includeProposedTraits]);

  const traitOptions = (trait: Trait) => {
    const proposed = trait.values.filter(t => t.stage === Stage.PROPOSED);
    const protocol = trait.values.filter(t => t.stage === Stage.PROTOCOL);
    const custom = trait.values.filter(t => t.stage === Stage.CUSTOM);

    if ((!includeProposedTraits || !proposed?.length) && !custom.length) {
      return [...Array(protocol.length + 1)].map((_, index) => {
        const { name } = protocol[index - 1] || {};
        const parsedTitle = index === 0 ? `Random` : parseTraitName(name);
        return (
          <option key={index} value={name}>
            {parsedTitle}
          </option>
        );
      });
    }

    const customTraitOptions = custom?.length && (
      <optgroup label="Custom">
        {[...Array(custom.length)].map((_, index) => {
          const { name } = custom[index];
          return (
            <option key={index} value={name}>
              {parseTraitName(name)}
            </option>
          );
        })}
      </optgroup>
    );
    const proposedTraitOptions = proposed?.length && (
      <optgroup label="Proposed">
        {[...Array(proposed.length)].map((_, index) => {
          const { name } = proposed[index];
          return (
            <option key={index} value={name}>
              {parseTraitName(name)}
            </option>
          );
        })}
      </optgroup>
    );
    const protocolTraitOptions = (
      <optgroup label="Protocol">
        {[...Array(protocol.length)].map((_, index) => {
          const { name } = protocol[index];
          return (
            <option key={index} value={name}>
              {parseTraitName(name)}
            </option>
          );
        })}
      </optgroup>
    );
    return (
      <>
        <option key="0">Random</option>
        {customTraitOptions}
        {proposedTraitOptions}
        {protocolTraitOptions}
      </>
    );
  };

  const traitButtonHandler = (trait: Trait, traitIndex: number) => {
    setModSeed(prev => {
      // -1 traitIndex = random
      if (traitIndex < 0) {
        let state = { ...prev };
        delete state[trait.title];
        return state;
      }
      return {
        ...prev,
        [trait.title]: traitIndex,
      };
    });
  };

  const resetTraitFileUpload = () => {
    if (customTraitFileRef.current) {
      customTraitFileRef.current.value = '';
    }
  };

  let pendingTraitErrorTimeout: NodeJS.Timeout;
  const setPendingTraitsInvalid = () => {
    setPendingTraitsValid(false);
    resetTraitFileUpload();
    pendingTraitErrorTimeout = setTimeout(() => {
      setPendingTraitsValid(undefined);
    }, 5_000);
  };

  const validateAndSetCustomTraits = async (files: FileList | null) => {
    if (pendingTraitErrorTimeout) {
      clearTimeout(pendingTraitErrorTimeout);
    }
    if (!files?.length) {
      return;
    }

    try {
      const traits = await Promise.all<PendingCustomTrait>(
        Array.from(files).map(file => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
              const buffer = Buffer.from(e?.target?.result!);
              const png = PNG.sync.read(buffer);
              if (png.width !== 32 || png.height !== 32) {
                throw new Error('Image must be 32x32');
              }
              const filename = file.name?.replace('.png', '') || 'custom';
              const data = encoder.encodeImage(filename, {
                width: png.width,
                height: png.height,
                rgbaAt: (x: number, y: number) => {
                  const idx = (png.width * y + x) << 2;
                  const [r, g, b, a] = [
                    png.data[idx],
                    png.data[idx + 1],
                    png.data[idx + 2],
                    png.data[idx + 3],
                  ];
                  return {
                    r,
                    g,
                    b,
                    a,
                  };
                },
              });
              resolve({
                data,
                filename,
              });
            };
            reader.readAsArrayBuffer(file);
          });
        }),
      );
      setPendingTraits({
        traits,
        type: TraitType.HEAD,
      });
      setPendingTraitsValid(true);
    } catch (error) {
      setPendingTraitsInvalid();
    }
  };

  const uploadCustomTraits = () => {
    const additions = pendingTraits?.traits
      ?.map(pendingTrait => {
        const { type } = pendingTraits;
        const { data, filename } = pendingTrait || {};
        if (!type || !data || !filename) {
          return null;
        }

        const title = traitTypeToTitle[type];
        const trait = traits?.[type];

        trait?.values.unshift({
          stage: Stage.CUSTOM,
          name: filename,
          data,
        });

        return {
          title,
          trait,
        };
      })
      .filter(Boolean);

    const lastAddition = additions?.[additions.length - 1];
    if (lastAddition?.trait && lastAddition?.title) {
      traitButtonHandler(lastAddition.trait, 0);
      setSelectIndexes({
        ...selectIndexes,
        [lastAddition.title]: 0,
      });
    }

    setTraits(traits);

    resetTraitFileUpload();
    setPendingTraits(undefined);
    setPendingTraitsValid(undefined);
  };

  return (
    <>
      {displayNoun && indexOfNounToDisplay !== undefined && nounSvgs && (
        <NounModal
          onDismiss={() => {
            setDisplayNoun(false);
          }}
          svg={nounSvgs[indexOfNounToDisplay]}
        />
      )}

      <Container fluid="lg">
        <Row>
          <Col lg={10} className={classes.headerRow}>
            <span>
              <Trans>Explore</Trans>
            </span>
            <h1>
              <Trans>Playground</Trans>
            </h1>
            <p>
              The {nounsProtocolLink} code and artwork are upgradeable and extensible. Noun artwork
              can be voted into the protocol by the DAO.
            </p>
            <p>
              <b>You</b> can contribute artwork that will be considered for inclusion in the
              protocol. Contribution documentation can be found in the {noundryLink} repository.
            </p>
            <FormCheck
              type="switch"
              id="proposed-trait-switch"
              label="Show Community Proposed Traits"
              checked={includeProposedTraits}
              onChange={e => setIncludeProposedTraits(e.target.checked)}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Col lg={12}>
              <Button
                onClick={() => {
                  generateNounSvg();
                }}
                className={classes.primaryBtn}
              >
                <Trans>Generate Nouns</Trans>
              </Button>
            </Col>
            <Row>
              {Object.values(traits || {})?.map((trait: Trait, index: number) => {
                return (
                  <Col lg={12} xs={6}>
                    <Form className={classes.traitForm}>
                      <FloatingLabel
                        controlId="floatingSelect"
                        label={capitalizeFirstLetter(trait.title)}
                        key={index}
                        className={classes.floatingLabel}
                      >
                        <Form.Select
                          aria-label="Select Trait"
                          className={classes.traitFormBtn}
                          value={
                            traits?.[trait.type].values[selectIndexes?.[trait.title]]?.name ?? -1
                          }
                          onChange={e => {
                            let index = e.currentTarget.selectedIndex;
                            traitButtonHandler(trait, index - 1); // - 1 to account for 'random'
                            setSelectIndexes({
                              ...selectIndexes,
                              [trait.title]: index - 1,
                            });
                          }}
                        >
                          {traitOptions(trait)}
                        </Form.Select>
                      </FloatingLabel>
                    </Form>
                  </Col>
                );
              })}
            </Row>
            <label style={{ margin: '1rem 0 .25rem 0' }} htmlFor="custom-trait-upload">
              <Trans>Upload Custom Trait</Trans>
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={
                  <Popover>
                    <div style={{ padding: '0.25rem' }}>
                      <Trans>Only 32x32 PNG images are accepted</Trans>
                    </div>
                  </Popover>
                }
              >
                <Image
                  style={{ margin: '0 0 .25rem .25rem' }}
                  src={InfoIcon}
                  className={classes.voteIcon}
                />
              </OverlayTrigger>
            </label>
            <Form.Control
              type="file"
              multiple
              id="custom-trait-upload"
              accept="image/PNG"
              isValid={arePendingTraitsValid}
              isInvalid={arePendingTraitsValid === false}
              ref={customTraitFileRef}
              className={classes.fileUpload}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                validateAndSetCustomTraits(e.target.files)
              }
            />
            {!!pendingTraits && (
              <>
                <FloatingLabel label="Custom Trait Type" className={classes.floatingLabel}>
                  <Form.Select
                    aria-label="Custom Trait Type"
                    className={classes.traitFormBtn}
                    onChange={e =>
                      setPendingTraits({
                        type: e.target.value as TraitType,
                        traits: pendingTraits.traits,
                      })
                    }
                  >
                    {Object.entries(traitTypeToTitle).map(([key, title]) => (
                      <option value={key}>{capitalizeFirstLetter(title)}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <Button onClick={() => uploadCustomTraits()} className={classes.primaryBtn}>
                  Upload
                </Button>
              </>
            )}
            <p className={classes.nounYearsFooter}>
              <Trans>
                You've generated{' '}
                {i18n.number(parseInt(nounSvgs ? (nounSvgs.length / 365).toFixed(2) : '0'))} years
                worth of Nouns
              </Trans>
            </p>
          </Col>
          <Col lg={9}>
            <Row>
              {nounSvgs?.map((svg, i) => {
                return (
                  <Col xs={4} lg={3} key={i}>
                    <div
                      onClick={() => {
                        setIndexOfNounToDisplay(i);
                        setDisplayNoun(true);
                      }}
                    >
                      <Noun
                        imgPath={`data:image/svg+xml;base64,${btoa(svg)}`}
                        alt="noun"
                        className={classes.nounImg}
                        wrapperClassName={classes.nounWrapper}
                      />
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
