'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import { getNounData, getRandomNounSeed, ImageData } from '@noundry/nouns-assets';
import { buildSVG, EncodedImage, PNGCollectionEncoder } from '@nouns/sdk';
import { PNG } from 'pngjs';
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Image,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';

import InfoIcon from '@/assets/icons/Info.svg';
import Noun from '@/components/legacy-noun';
import Link from '@/components/link';

import NounModal from './noun-modal';
import classes from './playground.module.css';

interface Trait {
  title: string;
  traitNames: string[];
}

interface PendingCustomTrait {
  type: string;
  data: string;
  filename: string;
}

const nounsProtocolLink = (
  <Link
    text={<Trans>Nouns Protocol</Trans>}
    url="https://www.notion.so/Noun-Protocol-32e4f0bf74fe433e927e2ea35e52a507"
    leavesPage={true}
  />
);

const nounsAssetsLink = (
  <Link
    text="nouns-assets"
    url="https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-assets"
    leavesPage={true}
  />
);

const nounsSDKLink = (
  <Link
    text="nouns-sdk"
    url="https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-sdk"
    leavesPage={true}
  />
);

const DEFAULT_TRAIT_TYPE = 'heads';

const encoder = new PNGCollectionEncoder(ImageData.palette);

const traitKeyToTitle: Record<string, string> = {
  heads: 'head',
  glasses: 'glasses',
  bodies: 'body',
  accessories: 'accessory',
};

const parseTraitName = (partName: string): string =>
  capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1));

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const traitKeyToLocalizedTraitKeyFirstLetterCapitalized = (s: string) => {
  switch (s) {
    case 'background':
      return <Trans>Background</Trans>;
    case 'body':
      return <Trans>Body</Trans>;
    case 'accessory':
      return <Trans>Accessory</Trans>;
    case 'head':
      return <Trans>Head</Trans>;
    case 'glasses':
      return <Trans>Glasses</Trans>;
    default:
      throw new Error(`Unknown trait key: ${s}`);
  }
};

const Playground: React.FC = () => {
  const [nounSvgs, setNounSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);
  const [displayNoun, setDisplayNoun] = useState<boolean>(false);
  const [indexOfNounToDisplay, setIndexOfNounToDisplay] = useState<number>();
  const [selectIndexes, setSelectIndexes] = useState<Record<string, number>>({});
  const [pendingTrait, setPendingTrait] = useState<PendingCustomTrait>();
  const [isPendingTraitValid, setPendingTraitValid] = useState<boolean>();

  const customTraitFileRef = useRef<HTMLInputElement>(null);

  const generateNounSvg = React.useCallback(
    (amount: number = 1) => {
      for (let i = 0; i < amount; i++) {
        const seed = { ...getRandomNounSeed(), ...modSeed };

        // Adjust background index for offset caused by transparent being first
        if (modSeed?.background !== undefined && modSeed.background > 0) {
          seed.background = modSeed.background - 1;
        }

        const { parts, background } = getNounData(seed);

        // Handle transparent background option
        let finalBackground: string | undefined = background;
        if (modSeed?.background === 0) {
          // 0 is the index for 'transparent'
          finalBackground = undefined;
        }

        const svg = buildSVG(parts, encoder.data.palette, finalBackground);
        setNounSvgs(prev => {
          return prev ? [svg, ...prev] : [svg];
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingTrait, modSeed],
  );

  useEffect(() => {
    const traitTitles = ['background', 'body', 'accessory', 'head', 'glasses'];
    const traitNames = [
      ['transparent', 'cool', 'warm'],
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

  const traitOptions = (trait: Trait) => {
    return Array.from(Array(trait.traitNames.length + 1)).map((_, index) => {
      const traitName = trait.traitNames[index - 1];
      const parsedTitle = index === 0 ? `Random` : parseTraitName(traitName);
      return (
        <option key={index} value={traitName}>
          {parsedTitle}
        </option>
      );
    });
  };

  const traitButtonHandler = (trait: Trait, traitIndex: number) => {
    setModSeed(prev => {
      // -1 traitIndex = random
      if (traitIndex < 0) {
        const state = { ...prev };
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

  let pendingTraitErrorTimeout: NodeJS.Timeout | undefined;
  const setPendingTraitInvalid = () => {
    setPendingTraitValid(false);
    resetTraitFileUpload();
    pendingTraitErrorTimeout = setTimeout(() => {
      setPendingTraitValid(undefined);
    }, 5_000);
  };

  const validateAndSetCustomTrait = (file: File | undefined) => {
    if (pendingTraitErrorTimeout !== undefined) {
      clearTimeout(pendingTraitErrorTimeout);
    }
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const result = e?.target?.result;
        const buffer = Buffer.from(
          result instanceof ArrayBuffer ? new Uint8Array(result) : new Uint8Array(),
        );
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
        setPendingTrait({
          data,
          filename,
          type: DEFAULT_TRAIT_TYPE,
        });
        setPendingTraitValid(true);
      } catch {
        setPendingTraitInvalid();
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadCustomTrait = () => {
    const { type, data, filename } = pendingTrait || {};
    if (type && data && filename) {
      const images = ImageData.images as Record<string, EncodedImage[]>;
      images[type].unshift({
        filename,
        data,
      });
      const title = traitKeyToTitle[type];
      const trait = traits?.find(t => t.title === title);

      resetTraitFileUpload();
      setPendingTrait(undefined);
      setPendingTraitValid(undefined);
      traitButtonHandler(trait!, 0);
      setSelectIndexes({
        ...selectIndexes,
        [title]: 0,
      });
    }
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
              <Trans>
                The playground was built using the {nounsProtocolLink}. Noun&apos;s traits are
                determined by the Noun Seed. The seed was generated using {nounsAssetsLink} and
                rendered using the {nounsSDKLink}.
              </Trans>
            </p>
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
              {traits &&
                traits.map((trait, index) => {
                  return (
                    <Col lg={12} xs={6} key={trait.title}>
                      <Form className={classes.traitForm}>
                        <FloatingLabel
                          controlId="floatingSelect"
                          label={traitKeyToLocalizedTraitKeyFirstLetterCapitalized(trait.title)}
                          key={index}
                          className={classes.floatingLabel}
                        >
                          <Form.Select
                            aria-label="Floating label select example"
                            className={classes.traitFormBtn}
                            value={trait.traitNames[selectIndexes?.[trait.title]] ?? -1}
                            onChange={e => {
                              const index = e.currentTarget.selectedIndex;
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
                trigger="hover"
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
                  style={{ margin: '0 0 .25rem .25rem', display: 'inline-block' }}
                  src={InfoIcon}
                  className={classes.voteIcon}
                />
              </OverlayTrigger>
            </label>
            <Form.Control
              type="file"
              id="custom-trait-upload"
              accept="image/PNG"
              isValid={isPendingTraitValid}
              isInvalid={isPendingTraitValid === false}
              ref={customTraitFileRef}
              className={classes.fileUpload}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                validateAndSetCustomTrait(e.target.files?.[0])
              }
            />
            {pendingTrait && (
              <>
                <FloatingLabel label="Custom Trait Type" className={classes.floatingLabel}>
                  <Form.Select
                    aria-label="Custom Trait Type"
                    className={classes.traitFormBtn}
                    onChange={e => setPendingTrait({ ...pendingTrait, type: e.target.value })}
                  >
                    {Object.entries(traitKeyToTitle).map(([key, title]) => (
                      <option value={key} key={key}>
                        {capitalizeFirstLetter(title)}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <Button onClick={() => uploadCustomTrait()} className={classes.primaryBtn}>
                  <Trans>Upload</Trans>
                </Button>
              </>
            )}
            <p className={classes.nounYearsFooter}>
              <Trans>
                You&apos;ve generated{' '}
                {i18n.number(Number(nounSvgs ? (nounSvgs.length / 365).toFixed(2) : '0'))} years
                worth of Nouns
              </Trans>
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
