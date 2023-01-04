import React, { ReactNode, useEffect, useState } from 'react';
import { useNounSeed } from '../../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { StandalonePart } from '../../StandalonePart';
import classes from './ExploreNounDetail.module.css';
import { ImageData } from '@nouns/assets';
import { Trans } from '@lingui/macro';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { XIcon } from '@heroicons/react/solid';
import NounInfoRowBirthday from '../../NounInfoRowBirthday';
import loadingNoun from '../../../assets/loading-skull-noun.gif';
import Placeholder from 'react-bootstrap/Placeholder';
import Image from 'react-bootstrap/Image';
import cx from 'classnames';
import { useSwipeable } from 'react-swipeable';

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};
interface ExploreNounDetailProps {
  nounId: number;
  noun: Noun;
  nounCount: number;
  handleCloseDetail: Function;
  handleNounNavigation: Function;
  handleFocusNoun: Function;
  handleScrollTo: Function;
  selectedNoun?: number;
  isVisible: boolean;
  setIsNounHoverDisabled: Function;
  disablePrev: boolean;
  disableNext: boolean;
}

const ExploreNounDetail: React.FC<ExploreNounDetailProps> = props => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const seedId =
    props.noun?.id != null && props.noun?.id >= 0
      ? BigNumber.from(props.noun.id)
      : BigNumber.from(0);
  const seed = useNounSeed(seedId);
  const bgcolors = ['#d5d7e1', '#e1d7d5'];
  const backgroundColor = seed ? bgcolors[seed.background] : bgcolors[0];
  const nounId = props.noun && props.noun.id != null && props.noun.id >= 0 ? props.noun.id : null;

  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  // Modified from playground function to remove dashes in filenames
  const parseTraitName = (partName: string): string =>
    capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1).replace(/-/g, ' '));
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

  const traitTypeKeys = (s: string) => {
    const traitMap = new Map([
      ['background', 'backgrounds'],
      ['body', 'bodies'],
      ['accessory', 'accessories'],
      ['head', 'heads'],
      ['glasses', 'glasses'],
    ]);
    const result = traitMap.get(s);
    if (result) {
      return result;
    } else {
      throw new Error(`Trait key for ${s} not found`);
    }
  };

  const traitNames = [
    ['cool', 'warm'],
    ...Object.values(ImageData.images).map(i => {
      return i.map(imageData => imageData.filename);
    }),
  ];

  const getOrderedTraits = (seed: {
    head: number;
    glasses: number;
    accessory: number;
    body: number;
    background: number;
  }) => {
    let nounTraitsOrdered;
    const loadingNounTraits = [
      {
        partType: 'head',
        partName: 'Skull',
        partIndex: -1,
      },
      {
        partType: 'glasses',
        partName: 'Processing',
        partIndex: -1,
      },
      {
        partType: 'accessory',
        partName: 'Loading',
        partIndex: -1,
      },
      {
        partType: 'body',
        partName: 'Placeholder',
        partIndex: -1,
      },
      {
        partType: 'background',
        partName: 'cool',
        partIndex: -1,
      },
    ];

    if (seed) {
      nounTraitsOrdered = [
        {
          partType: 'head',
          partName: parseTraitName(traitNames[3][seed.head]),
          partIndex: seed.head,
        },
        {
          partType: 'glasses',
          partName: parseTraitName(traitNames[4][seed.glasses]),
          partIndex: seed.glasses,
        },
        {
          partType: 'accessory',
          partName: parseTraitName(traitNames[2][seed.accessory]),
          partIndex: seed.accessory,
        },
        {
          partType: 'body',
          partName: parseTraitName(traitNames[1][seed.body]),
          partIndex: seed.body,
        },
        {
          partType: 'background',
          partName: parseTraitName(traitNames[0][seed.background]),
          partIndex: seed.background,
        },
      ];
    }

    if (nounTraitsOrdered) {
      return nounTraitsOrdered;
    } else {
      return loadingNounTraits;
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => !props.disableNext && props.handleNounNavigation('next'),
    onSwipedRight: () => !props.disablePrev && props.handleNounNavigation('prev'),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const nounTraitsOrdered = getOrderedTraits(seed);
  const handleAnimationStart = () => {
    props.setIsNounHoverDisabled(true);
  };
  const handleAnimationComplete = () => {
    props.handleScrollTo(props.selectedNoun);
  };
  const motionVariants = {
    initial: {
      width: isMobile ? '100%' : '0%',
      x: isMobile ? 100 : 0,
    },
    animate: {
      width: isMobile ? '100%' : '33%',
      x: 0,
    },
    exit: {
      width: isMobile ? '100%' : '0%',
      x: isMobile ? 100 : 0,
      transition: {
        duration: isMobile ? 0.05 : 0.025,
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && (
          <motion.div
            className={classes.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className={classes.detailWrap}
        style={{
          background: backgroundColor,
        }}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationStart={() => handleAnimationStart()}
        onAnimationComplete={definition => {
          !isMobile && definition === 'animate' && handleAnimationComplete();
          !isMobile &&
            definition === 'exit' &&
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
        {...handlers}
      >
        <motion.div
          className={classes.detail}
          style={{
            background: backgroundColor,
          }}
          exit={{
            opacity: !isMobile ? 0 : 1,
            transition: {
              duration: 0.01,
            },
          }}
        >
          <button className={classes.close} onClick={() => props.handleCloseDetail()}>
            <XIcon className={classes.icon} />
          </button>
          <div
            className={classes.detailNounImage}
            onClick={() => props.handleScrollTo(props.selectedNoun)}
          >
            {nounId !== null && seed ? (
              <Image
                src={props.noun.imgSrc || `https://noun.pics/${nounId}.svg`}
                alt={`Noun ${nounId}`}
              />
            ) : (
              <Image src={loadingNoun} alt="Loading noun" />
            )}
          </div>

          <div className={classes.nounDetails}>
            <div className={classes.infoWrap}>
              <button
                onClick={() => props.handleNounNavigation('prev')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={props.disablePrev}
              >
                ←
              </button>
              <div className={classes.nounBirthday}>
                {nounId !== null && seed ? (
                  <>
                    <h2>Noun {nounId}</h2>
                    <NounInfoRowBirthday nounId={nounId} />
                  </>
                ) : (
                  <h2>Loading</h2>
                )}
              </div>
              <button
                onClick={() => props.handleNounNavigation('next')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={props.disableNext}
              >
                →
              </button>
            </div>

            <ul className={classes.traitsList}>
              {nounTraitsOrdered &&
                Object.values(nounTraitsOrdered).map((part, index) => {
                  const partType = traitTypeKeys(nounTraitsOrdered[index].partType);
                  return (
                    <li key={partType} id={partType}>
                      <div
                        className={classes.thumbnail}
                        style={{
                          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                        }}
                      >
                        <AnimatePresence>
                          {nounId !== null && seed && (
                            <StandalonePart partType={partType} partIndex={part.partIndex} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className={classes.description}>
                        <p className="small">
                          <AnimatePresence>
                            {nounId !== null && seed ? (
                              <motion.span>
                                {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(
                                  nounTraitsOrdered[index].partType,
                                )}
                              </motion.span>
                            ) : (
                              <motion.span>
                                <Placeholder as="span" animation="glow">
                                  <Placeholder xs={8} />
                                </Placeholder>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </p>
                        <p>
                          <strong>
                            <AnimatePresence>
                              {nounId !== null && seed ? (
                                <>{nounTraitsOrdered[index].partName}</>
                              ) : (
                                <Placeholder xs={12} animation="glow" />
                              )}
                            </AnimatePresence>
                          </strong>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
            {nounId !== null && seed && (
              <p className={classes.activityLink}>
                <a href={`/noun/${nounId}`}>
                  <Trans>Vote history</Trans>
                </a>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ExploreNounDetail;
