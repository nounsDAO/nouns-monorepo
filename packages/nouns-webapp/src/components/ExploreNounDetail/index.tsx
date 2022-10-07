import React, { ReactNode, useEffect, useState } from 'react';
import { useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
// import { StandaloneNounImage } from '../../components/StandaloneNoun';
import { StandalonePart } from '../StandalonePart';
import classes from './ExploreNounDetail.module.css';
import { ImageData } from '@nouns/assets';
import { Trans } from '@lingui/macro';
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';
import { XIcon } from '@heroicons/react/solid';
import NounInfoRowBirthday from '../NounInfoRowBirthday';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Placeholder from 'react-bootstrap/Placeholder';
import Image from 'react-bootstrap/Image'
import cx from 'classnames';

import dotenv from 'dotenv';
dotenv.config();
interface ExploreNounDetailProps {
    nounId: number;
    handleCloseDetail: Function;
    handleNounDetail: Function;
    handleNounNavigation: Function;
    isVisible: boolean;
    handleScrollTo: Function;
    disablePrev: boolean;
    disableNext: boolean;
    nounImgSrc: string | undefined;
}

// interface ExploreNounDetailTraitsProps {
//     partType: string;
//     part: (parameter) part: {
//         partType: string;
//         partName: string;
//         partIndex: number;
//     };
//     nounId: number;
//     backgroundColor: string;
//     isNounImageLoaded: boolean;
// }
// const ExploreNounDetailTrait: React.FC<ExploreNounDetailTraitsProps> = props => {
//     return (
//         <li
//             key={props.partType}
//             id={props.partType}
//         >
//             <div 
//                 className={classes.thumbnail}
//                 style={{
//                     backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
//                 }}
//             >
//                 <AnimatePresence>
//                     {props.nounId >= 0 && (
//                         <StandalonePart partType={props.partType} partIndex={part.partIndex} />
//                     )}
//                 </AnimatePresence>
//             </div>
            
//             <div className={classes.description}>
//                 <p className='small'>
//                     <AnimatePresence>
//                         {props.nounId >= 0 ? (
//                             <motion.span>
//                                 {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(nounTraitsOrdered[index].partType)}
//                             </motion.span>
//                         ) : (
//                             <motion.span>
//                                 <Placeholder as="span" animation="glow">
//                                     <Placeholder xs={8} />
//                                 </Placeholder>
//                             </motion.span>
//                         )}
//                     </AnimatePresence>
                        
//                 </p>
//                 <p>
//                     <strong>
//                     <AnimatePresence>
//                         {props.nounId >= 0 ? (
//                             <>{nounTraitsOrdered[index].partName}</>
//                         ) : (
//                             <Placeholder xs={12} animation="glow" />
//                         )}
//                     </AnimatePresence>
                        
//                     </strong>
//                 </p>
//             </div>
//         </li>
//     )
// }

const ExploreNounDetail: React.FC<ExploreNounDetailProps> = props => {
    // borrowed from /src/pages/Playground/NounModal/index.tsx
    const [width, setWidth] = useState<number>(window.innerWidth);
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

    
    
    const getOrderedTraits = (seed: { head: number; glasses: number; accessory: number; body: number; background: number; }) => {
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
            // console.log('all traits', nounTraitsOrdered)
            return nounTraitsOrdered;
        } else {
            // console.log('error', nounTraitsOrdered)
            return loadingNounTraits;
        }
    }

    const seedId = props.nounId >= 0 ? BigNumber.from(props.nounId) : BigNumber.from(0);
    const seed = useNounSeed(seedId);
    const bgcolors = ["#d5d7e1", "#e1d7d5"];
    const backgroundColor = seed ? bgcolors[seed.background] : bgcolors[0];
    const nounTraitsOrdered =  getOrderedTraits(seed);

    


    // const list = {
    //     visible: { 
    //         opacity: 1,
    //         transition: {
    //             staggerChildren: 0.01,
    //             when: "beforeChildren",
    //         },
    //     },
    //     hidden: { 
    //         opacity: 0,
    //         transition: {
    //             when: "afterChildren",
    //           },
    //     },
    //   }
      
    //   const item = {
    //     visible: { opacity: 1, y: 0 },
    //     hidden: { opacity: 0, y: -50 },
    //   }


    // const sidebarVariants = {
    //     closed: {
    //         width: isMobile ? "100%" : 0,
    //         x: isMobile ? 0 : 0,
    //         y: isMobile ? "100%" : 0,
    //     },
    //     open: {
    //         width: isMobile ? "100%" : "33%",
    //         x: 0,
    //         y: 0,
    //     },
    //     exit: {
    //         width: isMobile ? "100%" : 0,
    //         opacity: 0,
    //         x: isMobile ? 0 : 0,
    //         y: isMobile ? "100%" : 0,
    //         transition: {
    //             duration: 0.1,
    //             when: "afterChildren",
    //         },
    //     }
    // }    

    return (
        <>  
            <AnimatePresence>
                {isMobile && (
                    <motion.div className={classes.backdrop} initial={{opacity: 0}} animate={{opacity: 1}}></motion.div>
                )}
            </AnimatePresence>
            <motion.div 
                className={classes.detailWrap}
                // variants={sidebarVariants}
                // initial="open"
                // animate="open"
                // exit="exit"
                // layout
                style={{
                    background: backgroundColor,
                }}
                >
                    <div 
                        className={classes.detail}
                        style={{
                            background: backgroundColor,
                        }}
                    >
                        <button className={classes.close} onClick={() => props.handleCloseDetail()}>
                            <XIcon className={classes.icon} />
                        </button>
                                    <div
                                        className={classes.detailNounImage}
                                        onClick={() => props.handleScrollTo(props.nounId)}
                                    >   
                                        {/* <StandaloneNounImage nounId={BigNumber.from(props.nounId)} /> */}
                                        {props.nounId >= 0 && seed ? (
                                            <Image 
                                                // src={`https://noun.pics/${props.nounId}.svg`} 
                                                src={props.nounImgSrc || `https://noun.pics/${props.nounId}.svg`} 
                                                alt={`Noun ${props.nounId}`} 
                                                />
                                        ) : (
                                            <Image src={loadingNoun} alt="Loading nouns" />
                                        )}
                                    </div>
                                    
                                    <div className={classes.nounDetails}>
                                        <div className={classes.infoWrap}>
                                            <button
                                                onClick={() => props.handleNounNavigation('prev')}
                                                className={cx(classes.arrow, backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm)}
                                                disabled={props.disablePrev}
                                                >
                                                ←
                                            </button>
                                            <div className={classes.nounBirthday}>
                                                {props.nounId >= 0 && seed ? (
                                                    <>
                                                        <h2>Noun {props.nounId}</h2>
                                                        <NounInfoRowBirthday nounId={props.nounId} />    
                                                    </>
                                                ): (
                                                    <h2>Loading</h2>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => props.handleNounNavigation('next')}
                                                className={cx(classes.arrow, backgroundColor === bgcolors[0] ? classes.arrowCool : classes.arrowWarm)}
                                                disabled={props.disableNext}
                                            >
                                                →
                                            </button>
                                        </div>
                                        
                                        <motion.ul 
                                            className={classes.traitsList}
                                            // variants={list}
                                            // initial="hidden"
                                            // animate="visible"
                                            // layout
                                        >
                                            {nounTraitsOrdered && Object.values(nounTraitsOrdered).map((part,index) => {    
                                                const partType = traitTypeKeys(nounTraitsOrdered[index].partType);
                                                return (
                                                    <motion.li
                                                        // variants={item}
                                                        key={partType}
                                                        id={partType}
                                                    >
                                                        <div 
                                                            className={classes.thumbnail}
                                                            style={{
                                                                backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                                                            }}
                                                        >
                                                            <AnimatePresence>
                                                                {props.nounId >= 0 && seed && (
                                                                    <StandalonePart partType={partType} partIndex={part.partIndex} />
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        
                                                        <div className={classes.description}>
                                                            <p className='small'>
                                                                <AnimatePresence>
                                                                    {props.nounId >= 0 && seed ? (
                                                                        <motion.span>
                                                                            {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(nounTraitsOrdered[index].partType)}
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
                                                                    {props.nounId >= 0 && seed ? (
                                                                        <>{nounTraitsOrdered[index].partName}</>
                                                                    ) : (
                                                                        <Placeholder xs={12} animation="glow" />
                                                                    )}
                                                                </AnimatePresence>
                                                                    
                                                                </strong>
                                                            </p>
                                                        </div>
                                                    </motion.li>
                                                )
                                            })}
                                        </motion.ul>
                                        {props.nounId >= 0 && seed && (
                                            <p className={classes.activityLink}><a href={`/noun/${props.nounId}`}><Trans>Vote history</Trans></a></p>
                                        )}
                                    </div>
                    </div>
            </motion.div>
        </>
    )
}


export default ExploreNounDetail;
