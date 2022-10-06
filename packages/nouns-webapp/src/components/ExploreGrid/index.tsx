import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BigNumber } from 'ethers';
// import { StandaloneNounImage } from '../../components/StandaloneNoun';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../ExploreNounDetail';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import { useAppSelector } from '../../hooks';
import { Trans } from '@lingui/macro';
// import { Dropdown } from 'react-bootstrap';
import dotenv from 'dotenv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import Placeholder from 'react-bootstrap/Placeholder';

// import NounItemsRange from './NounItemsRange';
import ExploreGridItem from './ExploreGridItem';

dotenv.config();
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
    const nounCount = currentAuction ? BigNumber.from(currentAuction?.nounId).toNumber() + 1 : -1;

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    
    

    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
    const [selectedNoun, setSelectedNoun] = useState<number | undefined>(undefined);
    const [activeNoun, setActiveNoun] = useState<number>(-1);

    // get latest noun id, then replace loading sidebar state with latest noun
    useEffect(() => {
        // console.log('currentAuction', currentAuction);
        if (currentAuction?.nounId) {
            // console.log('currentAuction.nounId', currentAuction?.nounId);
            !isMobile && setSelectedNoun(BigNumber.from(currentAuction?.nounId).toNumber());
            !isMobile && setActiveNoun(BigNumber.from(currentAuction?.nounId).toNumber());
        }
        
    }, [currentAuction, isMobile]);

    const handleOnFocus = (nounId: number) => {
        if (document.activeElement && parseInt(document.activeElement.id) === selectedNoun) {
            
        } else {
            focusNoun(nounId);
        }
    }

    // const removeFocus = () => {
    //     setIsSidebarVisible(false);
    //     setActiveNoun(-1);
    //     setSelectedNoun(undefined);
    // }
    
    const handleNounDetail = (nounId: number, sidebarVisibility: string, event: React.MouseEvent | React.FocusEvent) => {
        console.log('handleNounDetail');
        // if (isSidebarVisible === true) {
            handleScrollTo(nounId);
        // }
        if (nounId === selectedNoun) {
            handleCloseDetail();
        } else {
            nounId > -1 && nounId < nounCount && setActiveNoun(nounId);
            nounId > -1 && nounId < nounCount && setSelectedNoun(nounId);  
            setIsSidebarVisible(true)  
        }
    }

    const handleCloseDetail = () => {
        setIsSidebarVisible(false);
        setActiveNoun(-1);
        setSelectedNoun(undefined);
    }

    const handleNounNavigation = (direction: string) => {
        if ((sortOrder === "date-ascending" && direction === 'next') || (sortOrder === "date-descending" && direction === 'prev')) {
            setActiveNoun(activeNoun + 1);
            setSelectedNoun(activeNoun + 1);
        } else {
            setActiveNoun(activeNoun - 1);
            setSelectedNoun(activeNoun - 1);
        }
    }

    const keyboardPrev: boolean = useKeyPress("ArrowLeft");
    const keyboardNext: boolean = useKeyPress("ArrowRight");
    const keyboardUp: boolean = useKeyPress("ArrowUp");
    const keyboardDown: boolean = useKeyPress("ArrowDown");
    const keyboardEsc: boolean = useKeyPress("Escape");

    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
    const focusNoun = (index: number) => {
        index && buttonsRef.current[index]?.focus();
        setActiveNoun(index);
        setSelectedNoun(index);
        setIsSidebarVisible(true);
    };

    const handleScrollTo = (nounId: number) => {
        setIsKeyboardNavigating(true);
        nounId && buttonsRef.current[nounId]?.scrollIntoView({behavior: 'smooth'});
    };
    
    const [isKeyboardNavigating, setIsKeyboardNavigating] = useState<boolean>(false);

    useLayoutEffect(() => {

        handleScrollTo(selectedNoun || 400);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSidebarVisible])

    useEffect(() => {
        window.addEventListener('mousemove', (event) => {});
        onmousemove = () => { 
            setIsKeyboardNavigating(false);
        };
    
        return () => {
        //   window.removeEventListener('mousemove', onMouseMove);
        };
      }, []);

      useEffect(() => {
        setIsKeyboardNavigating(true);
        let amountToMove = 10;
        if (width <= 400) {
            amountToMove = 3;
        }
        if (width <= 991) {
            amountToMove = 5;
        }
        if (width <= 1399) {
            amountToMove = 8;
        }

        if (selectedNoun !== undefined && selectedNoun >= 0) {
            if (keyboardEsc) {
                setIsSidebarVisible(false);
                setSelectedNoun(undefined);
                setIsKeyboardNavigating(false);
            }
            if (sortOrder === "date-descending") {
                if (keyboardPrev && (selectedNoun + 1 < nounCount)) {
                    focusNoun(selectedNoun + 1);
                }
                if (keyboardNext && (selectedNoun - 1 >= 0)) {
                    focusNoun(selectedNoun - 1);
                }
                if (keyboardUp && (selectedNoun + amountToMove < nounCount)) {
                    focusNoun(selectedNoun + amountToMove);
                }
                if (keyboardDown && (selectedNoun - amountToMove >= 0)) {
                    focusNoun(selectedNoun - amountToMove);
                }
            } else {
                if (keyboardPrev && (selectedNoun - 1 >= 0)) {
                    focusNoun(selectedNoun - 1);
                }
                if (keyboardNext && (selectedNoun + 1 < nounCount)) {
                    focusNoun(selectedNoun + 1);
                }
                if (keyboardUp && (selectedNoun - amountToMove >= 0)) {
                    focusNoun(selectedNoun - amountToMove);
                }
                if (keyboardDown && (selectedNoun + amountToMove < nounCount)) {
                    focusNoun(selectedNoun + amountToMove);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, keyboardEsc]);
    const containerRef = useRef(null);
    

    const sortOptions = [
        {
            label: "Latest Nouns", value: "date-descending"
        },
        {
            label: "Oldest Nouns", value: "date-ascending"
        },
    ]

    const [sortOrder, setSortOrder] = useState(sortOptions[0].value);

    const handleSortOrderChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSortOrder(event.target.value);
    };

    type NounPic = {
        id: number | null;
        svg: string | undefined;
    };
    const [nouns, setNouns] = useState<NounPic[]>([]);
    const [individualNouns, setIndividualNouns] = useState<NounPic[]>([]);
    const [placeholderNouns, setPlaceholderNouns] = useState<NounPic[]>([]);
    const [listToDisplay, setListToDisplay] = useState<NounPic[]>([]);
    const [listToDisplay2, setListToDisplay2] = useState<NounPic[]>([]);
    const [isNounsDataLoaded, setIsNounsDataLoaded] = useState<boolean>(false)
    useEffect(() => {
        const placeholderNoun: NounPic = {id: null, svg: undefined};
        const placeholderNounsData = new Array(250).fill(placeholderNoun).map((x, i): NounPic => {
            return {
                id: null,
                svg: undefined,
            }
        });
        setPlaceholderNouns(placeholderNounsData);
        console.log('placeholderNounsData', placeholderNounsData);
    }, []);
    
    const initialChunkSize = 10;
    const [individualCount, setIndividualCount] = useState<number>(initialChunkSize);
    const [ranges, 
        // setRanges
    ] = useState<number[][]>([]);
    
    const rangeCalls = async (nounCount: number) => {
        
        
        if (nounCount >= 0) {
            // const promises = [];
            setListToDisplay([]);
            const rangeChunkSize = 100;
            const placeholderNoun: NounPic = {id: null, svg: undefined};
            const individualIds = new Array(individualCount).fill(placeholderNoun).map((x, i): NounPic => {
                return {
                    id: i + (nounCount - individualCount),
                    svg: `https://noun.pics/${i + (nounCount - individualCount)}.svg`,
                }
            }).reverse();
            setListToDisplay(arr => [...arr, ...individualIds]);
            for (let i = nounCount - individualCount; i >= 0; i -= (rangeChunkSize)) {
                const start = i - rangeChunkSize < 0 ? 0 : i - rangeChunkSize;
                const end = i - 1;
                console.log(start, end);
                const nounsRange = await fetchNouns(start, end);

            }
        }
    };
    
    
    const fetchNouns = async (start: number, end: number) => {
        // console.log('fetchNouns', start, end);
        const url = `https://noun.pics/range?start=${start}&end=${end}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            const reverseOrder = json.reverse().map((noun: any, i: any) => noun);

            setListToDisplay(arr => [...arr, ...reverseOrder]);
            return reverseOrder;
        } catch (error) {
            console.log("error", error);
        }
    };
    
    // console.log('nouns fetched', nouns);
        
    useEffect(() => {
        if (ranges) {
            ranges.map((range, i) => {
                fetchNouns(range[0], range[1]);
                // eslint-disable-next-line array-callback-return
                return
            })
        }
        
    }, [ranges]);

    useEffect(() => {
        // setListToDisplay(individualNouns)
        setIndividualCount((nounCount % initialChunkSize) + 1)
        nounCount >= 0 && rangeCalls(nounCount);
        console.log('trigger by nounCount', nounCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nounCount]);
    useEffect(() => {
        console.log(listToDisplay2);
    }, [listToDisplay2]);
    
    console.log('listToDisplay', listToDisplay);

    const nounList = [...Array(nounCount >= 0 ? nounCount : 100)].reverse(); 
    return (
        <div className={classes.exploreWrap} ref={containerRef}>
            <div 
                className={classes.contentWrap}
                style={{
                    overflow: isMobile && isSidebarVisible ? 'hidden' : 'visible'
                }}
                >
                <div 
                    className={cx(
                        classes.gridWrap, 
                        isSidebarVisible && classes.sidebarVisible, 
                        !isSidebarVisible && classes.sidebarHidden,
                        isKeyboardNavigating && classes.isKeyboardNavigating
                    )}
                >
                     <div className={classes.nav}>
                        <h3><span><Trans>Explore</Trans></span> {nounCount >= 0 && (
                            <motion.span 
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                            >
                                <strong>{nounCount}</strong> Nouns
                            </motion.span>
                        )}
                        </h3>
                        <div className={classes.buttons}>
                            <div className={classes.sort}>
                                <div className={classes.selectWrap}>
                                    <select value={sortOrder} onChange={handleSortOrderChange}>
                                        {sortOptions.map(option => (
                                            <option key={option.label} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span>
                                        <FontAwesomeIcon icon={faSortDown} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>  
                    <motion.div 
                        className={cx(classes.exploreGrid)}> 
                            <ul>       
                               
                                        {(sortOrder === "date-ascending" ? nounList.reverse() : nounList).map((x, i) => {
                                            let nounId = null;
                                            let imgSrc = undefined; 
                                            let index = sortOrder === "date-ascending" ? Math.abs(i - nounCount + 1) : i;
                                            if (listToDisplay[index]) {
                                                nounId = listToDisplay[index].id;
                                                imgSrc = listToDisplay[index].svg;
                                            }
                                            return (
                                                <ExploreGridItem 
                                                    key={i}
                                                    nounId={nounId}
                                                    imgSrc={imgSrc}
                                                    selectedNoun={selectedNoun}
                                                    setActiveNoun={setActiveNoun}
                                                    isKeyboardNavigating={isKeyboardNavigating}
                                                    handleOnFocus={handleOnFocus}
                                                />
                                            )
                                        })}
                                        
                            </ul>             
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {isSidebarVisible && (
                            <ExploreNounDetail 
                                handleCloseDetail={() => handleCloseDetail()} 
                                handleNounDetail={handleNounDetail} 
                                handleNounNavigation={handleNounNavigation} 
                                nounId={activeNoun} 
                                isVisible={isSidebarVisible} 
                                handleScrollTo={handleScrollTo} 
                                disablePrev={((sortOrder === "date-ascending" && activeNoun === 0) || (sortOrder === "date-descending" && activeNoun === nounCount - 1)) ? true : false}
                                disableNext={((sortOrder === "date-ascending" && activeNoun === nounCount - 1) || (sortOrder === "date-descending" && activeNoun === 0)) ? true : false}
                            />
                        )}
                    </AnimatePresence>
            </div>
        </div>
        
    );
};

export default ExploreGrid;
