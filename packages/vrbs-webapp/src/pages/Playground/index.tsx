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
} from 'react-bootstrap';
import classes from './Playground.module.css';
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import Link from '../../components/Link';
import { ImageData, getVrbData, getRandomVrbSeed } from '@vrbs/assets';
import { buildSVG, EncodedImage, PNGCollectionEncoder } from '@vrbs/sdk';
import InfoIcon from '../../assets/icons/Info.svg';
import Vrb from '../../components/Vrb';
import VrbModal from './VrbModal';
import { PNG } from 'pngjs';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

interface Trait {
  title: string;
  traitNames: string[];
}

interface PendingCustomTrait {
  type: string;
  data: string;
  filename: string;
}

const vrbsProtocolLink = (
  <Link
    text={<Trans>Vrbs Protocol</Trans>}
    url="https://www.notion.so/Vrb-Protocol-32e4f0bf74fe433e927e2ea35e52a507"
    leavesPage={true}
  />
);

const vrbsAssetsLink = (
  <Link
    text="vrbs-assets"
    url="https://github.com/vrbsDAO/vrbs-monorepo/tree/master/packages/vrbs-assets"
    leavesPage={true}
  />
);

const vrbsSDKLink = (
  <Link
    text="vrbs-sdk"
    url="https://github.com/vrbsDAO/vrbs-monorepo/tree/master/packages/vrbs-sdk"
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

const traitKeyToLocalizedTraitKeyFirstLetterCapitalized = (s: string): ReactNode => {
  const traitMap = new Map([
    ['background', <Trans>Background</Trans>],
    ['body', <Trans>Body</Trans>],
    ['accessory', <Trans>Accessory</Trans>],
    ['head', <Trans>Head</Trans>],
    ['glasses', <Trans>Glasses</Trans>],
  ]);

  return traitMap.get(s);
};

const Playground: React.FC = () => {
  const [vrbSvgs, setVrbSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);
  const [displayVrb, setDisplayVrb] = useState<boolean>(false);
  const [indexOfVrbToDisplay, setIndexOfVrbToDisplay] = useState<number>();
  const [selectIndexes, setSelectIndexes] = useState<Record<string, number>>({});
  const [pendingTrait, setPendingTrait] = useState<PendingCustomTrait>();
  const [isPendingTraitValid, setPendingTraitValid] = useState<boolean>();

  const customTraitFileRef = useRef<HTMLInputElement>(null);

  const generateVrbSvg = React.useCallback(
    (amount: number = 1) => {
      for (let i = 0; i < amount; i++) {
        const seed = { ...getRandomVrbSeed(), ...modSeed };
        const { parts, background } = getVrbData(seed);
        const svg = buildSVG(parts, encoder.data.palette, background);
        setVrbSvgs(prev => {
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
      generateVrbSvg(8);
      setInitLoad(false);
    }
  }, [generateVrbSvg, initLoad]);

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
  const setPendingTraitInvalid = () => {
    setPendingTraitValid(false);
    resetTraitFileUpload();
    pendingTraitErrorTimeout = setTimeout(() => {
      setPendingTraitValid(undefined);
    }, 5_000);
  };

  const validateAndSetCustomTrait = (file: File | undefined) => {
    if (pendingTraitErrorTimeout) {
      clearTimeout(pendingTraitErrorTimeout);
    }
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      try {
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
        setPendingTrait({
          data,
          filename,
          type: DEFAULT_TRAIT_TYPE,
        });
        setPendingTraitValid(true);
      } catch (error) {
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
      {displayVrb && indexOfVrbToDisplay !== undefined && vrbSvgs && (
        <VrbModal
          onDismiss={() => {
            setDisplayVrb(false);
          }}
          svg={vrbSvgs[indexOfVrbToDisplay]}
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
                The playground was built using the {vrbsProtocolLink}. Vrb's traits are
                determined by the Vrb Seed. The seed was generated using {vrbsAssetsLink} and
                rendered using the {vrbsSDKLink}.
              </Trans>
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Col lg={12}>
              <Button
                onClick={() => {
                  generateVrbSvg();
                }}
                className={classes.primaryBtn}
              >
                <Trans>Generate Vrbs</Trans>
              </Button>
            </Col>
            <Row>
              {traits &&
                traits.map((trait, index) => {
                  return (
                    <Col lg={12} xs={6}>
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
                  style={{ margin: '0 0 .25rem .25rem' }}
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
                      <option value={key}>{capitalizeFirstLetter(title)}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <Button onClick={() => uploadCustomTrait()} className={classes.primaryBtn}>
                  <Trans>Upload</Trans>
                </Button>
              </>
            )}
            <p className={classes.vrbYearsFooter}>
              <Trans>
                You've generated{' '}
                {i18n.number(parseInt(vrbSvgs ? (vrbSvgs.length / 365).toFixed(2) : '0'))} years
                worth of Vrbs
              </Trans>
            </p>
          </Col>
          <Col lg={9}>
            <Row>
              {vrbSvgs &&
                vrbSvgs.map((svg, i) => {
                  return (
                    <Col xs={4} lg={3} key={i}>
                      <div
                        onClick={() => {
                          setIndexOfVrbToDisplay(i);
                          setDisplayVrb(true);
                        }}
                      >
                        <Vrb
                          imgPath={`data:image/svg+xml;base64,${btoa(svg)}`}
                          alt="vrb"
                          className={classes.vrbImg}
                          wrapperClassName={classes.vrbWrapper}
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
