import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../ExploreNounDetail';
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import { useAppSelector } from '../../hooks';
import { Trans } from '@lingui/macro';

interface ExploreGridProps {
}

// Custom hook
function useKeyPress(targetKey: string) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
  
    // Add event listeners
    useEffect(() => {
      // If pressed key is our target key then set to true
      function downHandler({ key }: KeyboardEvent) {
        if (key === targetKey) {
          setKeyPressed(true);
        }
      }
      // If released key is our target key then set to false
      const upHandler = ({ key }: KeyboardEvent) => {
        if (key === targetKey) {
          setKeyPressed(false);
        }
      };
  
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, [targetKey]); // rerun the effect if the targetKey changes
  
    return keyPressed;
  }

const ExploreGrid: React.FC<ExploreGridProps> = props => {
    // borrowed from /src/pages/Playground/NounModal/index.tsx
    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile: boolean = width <= 991;

    const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
    const nounCount = currentAuction ? BigNumber.from(currentAuction?.nounId).toNumber() + 1 : 400;

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    // const gridOptions = [2.5, 5, 12.5];
    const [isFullView] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
    const [activeSizeOption, setSizeOption] = useState<string>("large");
    const sizeOptions = ["small", "large"];

    const [activeNoun, setActiveNoun] = useState<number | undefined>();
    
    const handleNounDetail = (nounId: number, sidebarVisibility: string) => {
        nounId > -1 && nounId < nounCount && setActiveNoun(nounId);
        sidebarVisibility === "visible" ? setIsSidebarVisible(true) : setIsSidebarVisible(false);
        sidebarVisibility !== "visible" && setActiveNoun(undefined);
    }

    const keyboardPrev: boolean = useKeyPress("ArrowLeft");
    const keyboardNext: boolean = useKeyPress("ArrowRight");
    const keyboardUp: boolean = useKeyPress("ArrowUp");
    const keyboardDown: boolean = useKeyPress("ArrowDown");

    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
    const focusNoun = (index: number | undefined) => {
        index && buttonsRef.current[index]?.focus()
    };

    const handleScrollTo = (nounId: number) => {
        // ref.current?.scrollIntoView({behavior: 'smooth'});
        nounId && buttonsRef.current[nounId]?.scrollIntoView({behavior: 'smooth'});
    };

    const gridVariants = {
        closed: { 
            width: "100%", 
        },
        open: { 
            width: isMobile ? "100%" : "66%",
            transition: { 
                delay: .35,
            }
        },
    }
    const gridItemVariants = {
        small: { 
            width: "5%", 
        },
        standard: { 
            width: "14.28%",
        },
    }

    useEffect(() => {
        if (keyboardPrev) {
            focusNoun(activeNoun && activeNoun - 1);
        }
        if (keyboardNext) {
            focusNoun(activeNoun && activeNoun + 1);
        }
        if (keyboardUp) {
            if (activeSizeOption === "small") {
                focusNoun(activeNoun && activeNoun - 20);
            }
            if (activeSizeOption === "medium") {
                focusNoun(activeNoun && activeNoun - 10);
            }
            if (activeSizeOption === "large") {
                focusNoun(activeNoun && activeNoun - 7);
            }
        }
        if (keyboardDown) {
            if (activeSizeOption === "small") {
                focusNoun(activeNoun && activeNoun + 20);
            }
            if (activeSizeOption === "medium") {
                focusNoun(activeNoun && activeNoun + 10);
            }
            if (activeSizeOption === "large") {
                focusNoun(activeNoun && activeNoun + 7);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown]);

    const iconLargeGrid = <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M0 2.571A2.571 2.571 0 0 1 2.571 0h5.143a2.571 2.571 0 0 1 2.572 2.571v5.143a2.571 2.571 0 0 1-2.572 2.572H2.571A2.571 2.571 0 0 1 0 7.714V2.571Zm13.714 0A2.572 2.572 0 0 1 16.286 0h5.143A2.571 2.571 0 0 1 24 2.571v5.143a2.571 2.571 0 0 1-2.571 2.572h-5.143a2.572 2.572 0 0 1-2.572-2.572V2.571ZM0 16.286a2.572 2.572 0 0 1 2.571-2.572h5.143a2.572 2.572 0 0 1 2.572 2.572v5.143A2.571 2.571 0 0 1 7.714 24H2.571A2.571 2.571 0 0 1 0 21.429v-5.143Zm13.714 0a2.572 2.572 0 0 1 2.572-2.572h5.143A2.571 2.571 0 0 1 24 16.286v5.143A2.57 2.57 0 0 1 21.429 24h-5.143a2.571 2.571 0 0 1-2.572-2.571v-5.143Z"/></svg></>;
    const iconSmallGrid = <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M0 1.714A1.714 1.714 0 0 1 1.714 0h3.429a1.714 1.714 0 0 1 1.714 1.714v3.429a1.714 1.714 0 0 1-1.714 1.714H1.714A1.714 1.714 0 0 1 0 5.143V1.714Zm8.571 0A1.714 1.714 0 0 1 10.286 0h3.428a1.714 1.714 0 0 1 1.715 1.714v3.429a1.714 1.714 0 0 1-1.715 1.714h-3.428A1.714 1.714 0 0 1 8.57 5.143V1.714Zm8.572 0A1.714 1.714 0 0 1 18.857 0h3.429A1.714 1.714 0 0 1 24 1.714v3.429a1.714 1.714 0 0 1-1.714 1.714h-3.429a1.714 1.714 0 0 1-1.714-1.714V1.714ZM0 10.286A1.714 1.714 0 0 1 1.714 8.57h3.429a1.714 1.714 0 0 1 1.714 1.715v3.428a1.714 1.714 0 0 1-1.714 1.715H1.714A1.714 1.714 0 0 1 0 13.714v-3.428Zm8.571 0a1.714 1.714 0 0 1 1.715-1.715h3.428a1.714 1.714 0 0 1 1.715 1.715v3.428a1.714 1.714 0 0 1-1.715 1.715h-3.428a1.714 1.714 0 0 1-1.715-1.715v-3.428Zm8.572 0a1.714 1.714 0 0 1 1.714-1.715h3.429A1.714 1.714 0 0 1 24 10.286v3.428a1.714 1.714 0 0 1-1.714 1.715h-3.429a1.714 1.714 0 0 1-1.714-1.715v-3.428ZM0 18.857a1.714 1.714 0 0 1 1.714-1.714h3.429a1.714 1.714 0 0 1 1.714 1.714v3.429A1.714 1.714 0 0 1 5.143 24H1.714A1.714 1.714 0 0 1 0 22.286v-3.429Zm8.571 0a1.714 1.714 0 0 1 1.715-1.714h3.428a1.714 1.714 0 0 1 1.715 1.714v3.429A1.714 1.714 0 0 1 13.714 24h-3.428a1.714 1.714 0 0 1-1.715-1.714v-3.429Zm8.572 0a1.714 1.714 0 0 1 1.714-1.714h3.429A1.714 1.714 0 0 1 24 18.857v3.429A1.714 1.714 0 0 1 22.286 24h-3.429a1.714 1.714 0 0 1-1.714-1.714v-3.429Z"/></svg></>;  

    return (
        <div className={classes.exploreWrap}>
            <div 
                className={classes.contentWrap}
                style={{
                    overflow: isMobile && isSidebarVisible ? 'hidden' : 'visible'
                }}

                >
                {/* Todo: move wrapper into parent component */}
                <motion.div 
                    className={cx(classes.gridWrap, isSidebarVisible && classes.sidebarVisible)}
                    layout            
                    variants={gridVariants}
                    initial={!isSidebarVisible && "closed"}
                    animate={isSidebarVisible ? "open" : "closed"}
                    transition={{
                        delay: .05,
                    }}
                >
                    <div className={classes.nav}>
                        <h3><Trans>explore all <strong>{nounCount}</strong> Nouns</Trans></h3>
                        <div className={classes.sizing}>
                            <button className={classes.iconTextButton}><FontAwesomeIcon icon={faSort} />Auction date</button>
                            {sizeOptions.map((option, i) => {
                                return (
                                    <button 
                                        key={option} 
                                        onClick={() => setSizeOption(option)}
                                        className={cx(activeSizeOption === option && classes.activeLayout)}
                                    >   
                                        {i === 0 ? (
                                            iconSmallGrid
                                        ) : (
                                            iconLargeGrid
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>   
                    <motion.div 
                        className={cx(classes.exploreGrid, isFullView && classes.fullViewGrid, classes[activeSizeOption])}
                    >
                        <motion.ul
                            layout
                        >
                            {[...Array(nounCount)].map((x, i) =>
                                <motion.li 
                                    style={{ 
                                        "--animation-order": i, 
                                    } as React.CSSProperties
                                    }
                                    className={i === activeNoun ? classes.activeNoun : ''} 
                                    key={i}
                                    layout
                                    variants={gridItemVariants}
                                    initial="large"
                                    animate={activeSizeOption === "small" ? "small" : "standard"}
                                    transition={{ 
                                        stiffness: '50',
                                    }}
                                >   
                                    <button 
                                        ref={el => buttonsRef.current[i] = el} 
                                        onFocus={() => handleNounDetail(i, i === activeNoun ? 'close' : 'visible')}
                                        onClick={event => focusNoun(i)}
                                        >
                                        <StandaloneNounImage nounId={BigNumber.from(i)} />
                                    </button>
                                </motion.li>
                            )}
                        </motion.ul>
                    </motion.div>
                    </motion.div>
                    <AnimatePresence>
                        {isSidebarVisible && (
                            <motion.div 
                                className={cx(classes.detailBlock, isSidebarVisible && classes.sidebarVisible)}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isSidebarVisible && (
                            <ExploreNounDetail handleNounDetail={handleNounDetail} nounId={activeNoun} isVisible={isSidebarVisible} handleScrollTo={handleScrollTo} />
                                
                        )}
                    </AnimatePresence>
            </div>
        </div>
        
    );
};

export default ExploreGrid;
