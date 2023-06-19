import React, { ReactNode, useEffect, useState } from 'react';
import { useVrbSeed } from '../../../wrappers/vrbsToken';
import { BigNumber } from 'ethers';
import { StandalonePart } from '../../StandalonePart';
import classes from './ExploreDetail.module.css';
import { ImageData } from '@vrbs/assets';
import { Trans } from '@lingui/macro';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { XIcon } from '@heroicons/react/solid';
import InfoRowBirthday from '../../InfoRowBirthday';
import loadingVrb from '../../../assets/loading-skull.gif';
import Placeholder from 'react-bootstrap/Placeholder';
import Image from 'react-bootstrap/Image';
import cx from 'classnames';
import { useSwipeable } from 'react-swipeable';

type Vrb = {
  id: number | null;
  imgSrc: string | undefined;
};
interface ExploreDetailProps {
  vrbId: number;
  vrb: Vrb;
  vrbCount: number;
  handleCloseDetail: Function;
  handleVrbNavigation: Function;
  handleFocusVrb: Function;
  handleScrollTo: Function;
  selectedVrb?: number;
  isVisible: boolean;
  setIsVrbHoverDisabled: Function;
  disablePrev: boolean;
  disableNext: boolean;
}

const ExploreDetail: React.FC<ExploreDetailProps> = props => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const seedId =
    props.vrb?.id != null && props.vrb?.id >= 0
      ? BigNumber.from(props.vrb.id)
      : BigNumber.from(0);
  const seed = useVrbSeed(seedId);
  const bgcolors = ['#d5d7e1', '#e1d7d5'];
  const backgroundColor = seed ? bgcolors[seed.background] : bgcolors[0];
  const vrbId =
    props.vrb && props.vrb.id != null && props.vrb.id >= 0 ? props.vrb.id : null;

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
    let vrbTraitsOrdered;
    const loadingVrbTraits = [
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
      vrbTraitsOrdered = [
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

    if (vrbTraitsOrdered) {
      return vrbTraitsOrdered;
    } else {
      return loadingVrbTraits;
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => !props.disableNext && props.handleVrbNavigation('next'),
    onSwipedRight: () => !props.disablePrev && props.handleVrbNavigation('prev'),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const vrbTraitsOrdered = getOrderedTraits(seed);
  const handleAnimationStart = () => {
    props.setIsVrbHoverDisabled(true);
  };
  const handleAnimationComplete = () => {
    props.handleScrollTo(props.selectedVrb);
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
            className={classes.detailVrbImage}
            onClick={() => props.handleScrollTo(props.selectedVrb)}
          >
            {vrbId !== null && seed ? (
              <Image
                src={props.vrb.imgSrc || `https://vrb.pics/${vrbId}.svg`}
                alt={`Vrb ${vrbId}`}
              />
            ) : (
              <Image src={loadingVrb} alt="Loading vrb" />
            )}
          </div>

          <div className={classes.vrbDetails}>
            <div className={classes.infoWrap}>
              <button
                onClick={() => props.handleVrbNavigation('prev')}
                className={cx(
                  classes.arrow,
                  backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm,
                )}
                disabled={props.disablePrev}
              >
                ←
              </button>
              <div className={classes.vrbBirthday}>
                {vrbId !== null && seed ? (
                  <>
                    <h2>Vrb {vrbId}</h2>
                    <InfoRowBirthday vrbId={vrbId} />
                  </>
                ) : (
                  <h2>Loading</h2>
                )}
              </div>
              <button
                onClick={() => props.handleVrbNavigation('next')}
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
              {vrbTraitsOrdered &&
                Object.values(vrbTraitsOrdered).map((part, index) => {
                  const partType = traitTypeKeys(vrbTraitsOrdered[index].partType);
                  return (
                    <li key={partType} id={partType}>
                      <div
                        className={classes.thumbnail}
                        style={{
                          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                        }}
                      >
                        <AnimatePresence>
                          {vrbId !== null && seed && (
                            <StandalonePart partType={partType} partIndex={part.partIndex} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className={classes.description}>
                        <p className="small">
                          <AnimatePresence>
                            {vrbId !== null && seed ? (
                              <motion.span>
                                {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(
                                  vrbTraitsOrdered[index].partType,
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
                              {vrbId !== null && seed ? (
                                <>{vrbTraitsOrdered[index].partName}</>
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
            {vrbId !== null && seed && (
              <p className={classes.activityLink}>
                <a href={`/vrb/${vrbId}`}>
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

export default ExploreDetail;
