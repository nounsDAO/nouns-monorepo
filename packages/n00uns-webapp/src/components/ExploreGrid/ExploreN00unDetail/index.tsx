import React, { ReactNode, useEffect, useState } from 'react';
import { useN00unSeed } from '../../../wrappers/n00unToken';
import { BigNumber } from 'ethers';
import { StandalonePart } from '../../StandalonePart';
import classes from './ExploreN00unDetail.module.css';
import { ImageData } from '@n00uns/assets';
import { Trans } from '@lingui/macro';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { XIcon } from '@heroicons/react/solid';
import N00unInfoRowBirthday from '../../N00unInfoRowBirthday';
import loadingN00un from '../../../assets/loading-skull-n00un.gif';
import Placeholder from 'react-bootstrap/Placeholder';
import Image from 'react-bootstrap/Image';
import cx from 'classnames';
import { useSwipeable } from 'react-swipeable';

type N00un = {
  id: number | null;
  imgSrc: string | undefined;
};
interface ExploreN00unDetailProps {
  n00unId: number;
  n00un: N00un;
  n00unCount: number;
  handleCloseDetail: Function;
  handleN00unNavigation: Function;
  handleFocusN00un: Function;
  handleScrollTo: Function;
  selectedN00un?: number;
  isVisible: boolean;
  setIsN00unHoverDisabled: Function;
  disablePrev: boolean;
  disableNext: boolean;
}

const ExploreN00unDetail: React.FC<ExploreN00unDetailProps> = props => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const seedId =
    props.n00un?.id != null && props.n00un?.id >= 0
      ? BigNumber.from(props.n00un.id)
      : BigNumber.from(0);
  const seed = useN00unSeed(seedId);
  const bgcolors = ['#d5d7e1', '#e1d7d5'];
  const backgroundColor = seed ? bgcolors[seed.background] : bgcolors[0];
  const n00unId =
    props.n00un && props.n00un.id != null && props.n00un.id >= 0 ? props.n00un.id : null;

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
    let n00unTraitsOrdered;
    const loadingN00unTraits = [
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
      n00unTraitsOrdered = [
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

    if (n00unTraitsOrdered) {
      return n00unTraitsOrdered;
    } else {
      return loadingN00unTraits;
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => !props.disableNext && props.handleN00unNavigation('next'),
    onSwipedRight: () => !props.disablePrev && props.handleN00unNavigation('prev'),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const n00unTraitsOrdered = getOrderedTraits(seed);
  const handleAnimationStart = () => {
    props.setIsN00unHoverDisabled(true);
  };
  const handleAnimationComplete = () => {
    props.handleScrollTo(props.selectedN00un);
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
            className={classes.detailN00unImage}
            onClick={() => props.handleScrollTo(props.selectedN00un)}
          >
            {n00unId !== null && seed ? (
              <Image
                src={props.n00un.imgSrc || `https://n00un.pics/${n00unId}.svg`}
                alt={`N00un ${n00unId}`}
              />
            ) : (
              <Image src={loadingN00un} alt="Loading n00un" />
            )}
          </div>

          <div className={classes.n00unDetails}>
            <div className={classes.infoWrap}>
              <button
                onClick={() => props.handleN00unNavigation('prev')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={props.disablePrev}
              >
                ←
              </button>
              <div className={classes.n00unBirthday}>
                {n00unId !== null && seed ? (
                  <>
                    <h2>N00un {n00unId}</h2>
                    <N00unInfoRowBirthday n00unId={n00unId} />
                  </>
                ) : (
                  <h2>Loading</h2>
                )}
              </div>
              <button
                onClick={() => props.handleN00unNavigation('next')}
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
              {n00unTraitsOrdered &&
                Object.values(n00unTraitsOrdered).map((part, index) => {
                  const partType = traitTypeKeys(n00unTraitsOrdered[index].partType);
                  return (
                    <li key={partType} id={partType}>
                      <div
                        className={classes.thumbnail}
                        style={{
                          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                        }}
                      >
                        <AnimatePresence>
                          {n00unId !== null && seed && (
                            <StandalonePart partType={partType} partIndex={part.partIndex} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className={classes.description}>
                        <p className="small">
                          <AnimatePresence>
                            {n00unId !== null && seed ? (
                              <motion.span>
                                {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(
                                  n00unTraitsOrdered[index].partType,
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
                              {n00unId !== null && seed ? (
                                <>{n00unTraitsOrdered[index].partName}</>
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
            {n00unId !== null && seed && (
              <p className={classes.activityLink}>
                <a href={`/n00un/${n00unId}`}>
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

export default ExploreN00unDetail;
