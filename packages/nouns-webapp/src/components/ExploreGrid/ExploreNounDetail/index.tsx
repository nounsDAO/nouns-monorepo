import React, { useEffect, useState } from 'react';

import { XIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { ImageData } from '@noundry/nouns-assets';
import cx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'react-bootstrap/Image';
import Placeholder from 'react-bootstrap/Placeholder';
import { useSwipeable } from 'react-swipeable';

import loadingNoun from '@/assets/loading-skull-noun.gif';
import { StandalonePart } from '@/components/StandalonePart';
import { useNounSeed } from '@/wrappers/nounToken';

import classes from './ExploreNounDetail.module.css';

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

interface ExploreNounDetailProps {
  nounId: number;
  noun: Noun;
  nounCount: number;
  handleCloseDetail: () => void;
  handleNounNavigation: (direction: string) => void;
  handleFocusNoun: (nounId: number) => void;
  handleScrollTo: (nounId?: number) => void;
  selectedNoun?: number;
  isVisible: boolean;
  setIsNounHoverDisabled: (isDisabled: boolean) => void;
  disablePrev: boolean;
  disableNext: boolean;
}

const parseTraitName = (partName: string): string =>
  capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1).replace(/-/g, ' '));
const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const traitKeyToLocalizedTraitKeyFirstLetterCapitalized = (traitType: string) => {
  switch (traitType) {
    case 'background':
      return <Trans key="background">Background</Trans>;
    case 'body':
      return <Trans key="body">Body</Trans>;
    case 'accessory':
      return <Trans key="accessory">Accessory</Trans>;
    case 'head':
      return <Trans key="head">Head</Trans>;
    case 'glasses':
      return <Trans key="glasses">Glasses</Trans>;
    default:
      throw new Error(`Trait key for ${traitType} not found`);
  }
};

const ExploreNounDetail: React.FC<ExploreNounDetailProps> = ({
  disableNext,
  disablePrev,
  handleCloseDetail,
  handleNounNavigation,
  handleScrollTo,
  noun,
  selectedNoun,
  setIsNounHoverDisabled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const seedId = noun?.id != null && noun?.id >= 0 ? BigInt(noun.id) : BigInt(0);
  const seed = useNounSeed(seedId);
  const bgcolors = ['#d5d7e1', '#e1d7d5'];
  const backgroundColor = seed ? bgcolors[seed.background] : bgcolors[0];
  const nounId = noun && noun.id != null && noun.id >= 0 ? noun.id : null;
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

  const traitCategory = (traitType: string): string => {
    switch (traitType) {
      case 'background':
        return 'backgrounds';
      case 'body':
        return 'bodies';
      case 'accessory':
        return 'accessories';
      case 'head':
        return 'heads';
      case 'glasses':
        return 'glasses';
      default:
        throw new Error(`Trait key for ${traitType} not found`);
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
    return [
      {
        partType: 'head',
        partName: seed ? parseTraitName(traitNames[3][seed.head]) : 'Skull',
        partIndex: seed ? seed.head : -1,
      },
      {
        partType: 'glasses',
        partName: seed ? parseTraitName(traitNames[4][seed.glasses]) : 'Processing',
        partIndex: seed ? seed.glasses : -1,
      },
      {
        partType: 'accessory',
        partName: seed ? parseTraitName(traitNames[2][seed.accessory]) : 'Loading',
        partIndex: seed ? seed.accessory : -1,
      },
      {
        partType: 'body',
        partName: seed ? parseTraitName(traitNames[1][seed.body]) : 'Placeholder',
        partIndex: seed ? seed.body : -1,
      },
      {
        partType: 'background',
        partName: seed ? parseTraitName(traitNames[0][seed.background]) : 'cool',
        partIndex: seed ? seed.background : -1,
      },
    ];
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => !disableNext && handleNounNavigation('next'),
    onSwipedRight: () => !disablePrev && handleNounNavigation('prev'),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const nounTraitsOrdered = getOrderedTraits(seed);
  const handleAnimationStart = () => {
    setIsNounHoverDisabled(true);
  };
  const handleAnimationComplete = () => {
    handleScrollTo(selectedNoun);
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
          if (isMobile) {
            return;
          }
          if (definition === 'animate') {
            handleAnimationComplete();
          }
          if (definition === 'exit') {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
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
          <button className={classes.close} onClick={() => handleCloseDetail()}>
            <XIcon className={classes.icon} />
          </button>
          <div className={classes.detailNounImage} onClick={() => handleScrollTo(selectedNoun)}>
            {nounId !== null && seed ? (
              <Image
                src={noun.imgSrc || `https://noun.pics/${nounId}.svg`}
                alt={`Noun ${nounId}`}
              />
            ) : (
              <Image src={loadingNoun} alt="Loading noun" />
            )}
          </div>

          <div className={classes.nounDetails}>
            <div className={classes.infoWrap}>
              <button
                onClick={() => handleNounNavigation('prev')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={disablePrev}
              >
                ←
              </button>
              <div className={classes.nounBirthday}>
                {nounId !== null && seed ? (
                  <>
                    <h2>Noun {nounId}</h2>
                  </>
                ) : (
                  <h2>Loading</h2>
                )}
              </div>
              <button
                onClick={() => handleNounNavigation('next')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={disableNext}
              >
                →
              </button>
            </div>

            <ul className={classes.traitsList}>
              {nounTraitsOrdered &&
                Object.values(nounTraitsOrdered).map((part, index) => {
                  const partType = traitCategory(nounTraitsOrdered[index].partType);
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
                  <Trans>Go to auction</Trans>
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
