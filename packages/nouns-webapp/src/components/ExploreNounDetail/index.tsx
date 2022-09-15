import React, { ReactNode } from 'react';
import { useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import { StandalonePart } from '../StandalonePart';
import classes from './ExploreNounDetail.module.css';
import { ImageData } from '@nouns/assets';
import { Trans } from '@lingui/macro';
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';
import { XIcon } from '@heroicons/react/solid';

interface ExploreNounDetailProps {
    nounId: number | undefined;
    handleNounDetail: Function;
    isVisible: boolean;
}

const ExploreNounDetail: React.FC<ExploreNounDetailProps> = props => {
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

    const seed = useNounSeed(BigNumber.from(props.nounId));

    const nounTraitsOrdered = [
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
    ]

    const bgcolors = ["#d5d7e1", "#e1d7d5"];
    const backgroundColor = bgcolors[seed.background];

    const list = {
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                when: "beforeChildren",
            },
        },
        hidden: { 
            opacity: 0,
            transition: {
                when: "afterChildren",
              },
        },
      }
      
      const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -50 },
      }

      const detailsVariants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1,
        },
        exit: {
            y: 200,
            opacity: 0,
            transition: {
                duration: 0.1
            }
        }
      }

    const sidebarInnerVariants = {
        closed: { 
            opacity: 0, 
        },
        open: { 
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1,
                duration: 0.1
            }
        },
        exit: {
            y: 100,
            opacity: 0,
            transition: {
                duration: 0.1
            }
        }
    }

    const sidebarVariants = {
        closed: {
            width: 0,
            x: 100,
        },
        open: {
            width: "33%",
            x: 0,
            transition: {
                duration: 0.15,
                delayChildren: 0.2,
            }
        },
        exit: {
            width: 0,
            x: 100,
            transition: {
                duration: 0.15,
                when: "afterChildren",
            },
        }
    }

    return (
        <>  
            <motion.div 
                className={classes.detailWrap}
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="exit"
                layout
                style={{
                    background: backgroundColor,
                }}
                >
                <motion.div 
                    variants={sidebarInnerVariants}
                    >
                    <motion.div className={classes.detail}>
                        <button className={classes.close} onClick={() => props.handleNounDetail('close')}>
                            <XIcon className={classes.icon} />
                        </button>
                        <AnimatePresence exitBeforeEnter>
                            {props.isVisible && props.nounId && (
                                <motion.div
                                    variants={detailsVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    key={props.nounId}
                                >
                                    <motion.div
                                        className={classes.detailNounImage}
                                    >
                                        <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />
                                    </motion.div>
                                    
                                    <motion.div className={classes.nounDetails}>
                                        <motion.h2
                                            initial={{
                                                opacity: 0
                                            }}
                                            animate={{
                                                opacity: 1
                                            }}
                                        >
                                            Noun {props.nounId}
                                        </motion.h2>
                                        <motion.ul 
                                            className={classes.traitsList}
                                            variants={list}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {Object.values(nounTraitsOrdered).map((part,index) => {    
                                                const partType = traitTypeKeys(nounTraitsOrdered[index].partType);
                                                return (
                                                    <motion.li
                                                        variants={item}
                                                    >
                                                        <div 
                                                            className={classes.thumbnail}
                                                            style={{
                                                                backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                                                            }}
                                                        >
                                                            <StandalonePart partType={partType} partIndex={part.partIndex} />
                                                        </div>
                                                        <div className={classes.description}>
                                                            <p className='small'><span>{traitKeyToLocalizedTraitKeyFirstLetterCapitalized(nounTraitsOrdered[index].partType)}</span></p>
                                                            <p><strong>{nounTraitsOrdered[index].partName}</strong></p>
                                                        </div>
                                                    </motion.li>
                                                )
                                            })}
                                        </motion.ul>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    )
}


export default ExploreNounDetail;
