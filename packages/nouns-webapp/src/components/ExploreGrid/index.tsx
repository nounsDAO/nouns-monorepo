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

    
    

    // const [isFullView] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
    // const [activeSizeOption, 
    //     // setSizeOption
    // ] = useState<string>("large");

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
        // console.log('handle scroll', nounId, buttonsRef.current[nounId])
        setIsKeyboardNavigating(true);
        nounId && buttonsRef.current[nounId]?.scrollIntoView({behavior: 'smooth'});
    };
    
    const [isKeyboardNavigating, setIsKeyboardNavigating] = useState<boolean>(false);

    useLayoutEffect(() => {
        // const position = buttonsRef.current && buttonsRef.current[activeNoun]?.getBoundingClientRect();
        // console.log('position', position?.top)
        // console.log('sidebarFinishedOpening', sidebarFinishedOpening)
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

    // const iconLargeGrid = <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M0 2.571A2.571 2.571 0 0 1 2.571 0h5.143a2.571 2.571 0 0 1 2.572 2.571v5.143a2.571 2.571 0 0 1-2.572 2.572H2.571A2.571 2.571 0 0 1 0 7.714V2.571Zm13.714 0A2.572 2.572 0 0 1 16.286 0h5.143A2.571 2.571 0 0 1 24 2.571v5.143a2.571 2.571 0 0 1-2.571 2.572h-5.143a2.572 2.572 0 0 1-2.572-2.572V2.571ZM0 16.286a2.572 2.572 0 0 1 2.571-2.572h5.143a2.572 2.572 0 0 1 2.572 2.572v5.143A2.571 2.571 0 0 1 7.714 24H2.571A2.571 2.571 0 0 1 0 21.429v-5.143Zm13.714 0a2.572 2.572 0 0 1 2.572-2.572h5.143A2.571 2.571 0 0 1 24 16.286v5.143A2.57 2.57 0 0 1 21.429 24h-5.143a2.571 2.571 0 0 1-2.572-2.571v-5.143Z"/></svg></>;
    // const iconSmallGrid = <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M0 1.714A1.714 1.714 0 0 1 1.714 0h3.429a1.714 1.714 0 0 1 1.714 1.714v3.429a1.714 1.714 0 0 1-1.714 1.714H1.714A1.714 1.714 0 0 1 0 5.143V1.714Zm8.571 0A1.714 1.714 0 0 1 10.286 0h3.428a1.714 1.714 0 0 1 1.715 1.714v3.429a1.714 1.714 0 0 1-1.715 1.714h-3.428A1.714 1.714 0 0 1 8.57 5.143V1.714Zm8.572 0A1.714 1.714 0 0 1 18.857 0h3.429A1.714 1.714 0 0 1 24 1.714v3.429a1.714 1.714 0 0 1-1.714 1.714h-3.429a1.714 1.714 0 0 1-1.714-1.714V1.714ZM0 10.286A1.714 1.714 0 0 1 1.714 8.57h3.429a1.714 1.714 0 0 1 1.714 1.715v3.428a1.714 1.714 0 0 1-1.714 1.715H1.714A1.714 1.714 0 0 1 0 13.714v-3.428Zm8.571 0a1.714 1.714 0 0 1 1.715-1.715h3.428a1.714 1.714 0 0 1 1.715 1.715v3.428a1.714 1.714 0 0 1-1.715 1.715h-3.428a1.714 1.714 0 0 1-1.715-1.715v-3.428Zm8.572 0a1.714 1.714 0 0 1 1.714-1.715h3.429A1.714 1.714 0 0 1 24 10.286v3.428a1.714 1.714 0 0 1-1.714 1.715h-3.429a1.714 1.714 0 0 1-1.714-1.715v-3.428ZM0 18.857a1.714 1.714 0 0 1 1.714-1.714h3.429a1.714 1.714 0 0 1 1.714 1.714v3.429A1.714 1.714 0 0 1 5.143 24H1.714A1.714 1.714 0 0 1 0 22.286v-3.429Zm8.571 0a1.714 1.714 0 0 1 1.715-1.714h3.428a1.714 1.714 0 0 1 1.715 1.714v3.429A1.714 1.714 0 0 1 13.714 24h-3.428a1.714 1.714 0 0 1-1.715-1.714v-3.429Zm8.572 0a1.714 1.714 0 0 1 1.714-1.714h3.429A1.714 1.714 0 0 1 24 18.857v3.429A1.714 1.714 0 0 1 22.286 24h-3.429a1.714 1.714 0 0 1-1.714-1.714v-3.429Z"/></svg></>;  
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
        setNouns(nouns.reverse());
    };

    // useEffect(() => {
    //     const url = "https://noun.pics/range?start=0&end=9";       
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(url);
    //             const json = await response.json();
    //             console.log(response, json)
                
    //         } catch (error) {
    //             console.log("error", error);
    //         }
            
    //     };

    //     fetchData();
    // }, []);

    type NounPic = {
        id: number;
        svg: string;
    };

    // const placeholderNounsData = [Array(nounCount >= 0 ? nounCount : 100)].map((x, i) => {
    //     return {
    //         id: i,
    //         svg: '',
    //     }
    // });

    // const [nounsData, setNounsData] = useState<NounPic[]>(placeholderNounsData);
    // const [isNounsDataLoaded, setIsNounsDataLoaded] = useState<boolean>(false)
    // const fetchNouns = async (start: number, end: number) => {
    //     const url = `https://noun.pics/range?start=${start}&end=${end}`;
    //     try {
    //         const response = await fetch(url);
    //         const json = await response.json();
    //         return json;            
    //     } catch (error) {
    //         console.log("error", error);
    //     }
    // };

    const initialChunkSize = 10;
    const individualCount = (nounCount % initialChunkSize) + 1;
    // const rangeChunkSize = 100;
    // let rangeIds: number[][] = [];
    const [ranges, 
        // setRanges
    ] = useState<number[][]>([]);
    const [individualNouns, setIndividualNouns] = useState<number[]>([]);

    // const individualIds = new Array(individualCount - 1).fill(0).reverse();
    

    
    const rangeCalls = async (nounCount: number) => {
        
        
        if (nounCount >= 0) {
            const promises = [];
            const rangeChunkSize = 100;
            const individualIds = new Array(individualCount).fill(0).map((x, i) => i + (nounCount - individualCount)).reverse();
            setIndividualNouns(individualIds);
                
            for (let i = -1; i < nounCount; i += (rangeChunkSize)) {
                const start = i + 1;
                const end = i + rangeChunkSize > (nounCount - 1 - individualCount) ? i + (nounCount - i - 1 - individualCount) : i + rangeChunkSize;
                console.log(start, end);
                // fetchNouns(start, end);
                const data = await fetchNouns(start, end);
                promises.push(...data);
                // setNouns(arr => [...arr, ...data]);
                // console.log('range, i, start, end', rangeChunkSize, i, start, end);
            }
            Promise.all(promises).then((promises) => {
                console.log('promises', promises);
                console.log('nouns', nouns);
                // setNounsData(promises);

                // reverse order initially to show latest noun first
                setNouns(promises.reverse());
                // setIsNounsDataLoaded(true);
            });
        }
        console.log('nouns', nouns);
        console.log('individualNouns', individualNouns);

        
        // let rangeStartId: number = nounCount - individualCount + 1; // 457 to 450 inclusive = 8
        // let rangeEndId: number | undefined = undefined;
        // const individualIds = new Array(individualCount - 1)
        //     .fill(0)
        //     .map((_, i) => rangeStartId && i + rangeStartId)
        //     .reverse();
        // setIndividualNouns(individualIds);
        // // console.log('individualIds', individualIds);
        // // console.log('rangeCAlls', rangeStartId, rangeEndId)    

        // while (rangeStartId >= 0) {
        //     // Push end of previous range to start of new range eg [(400 - 1) = 399, 300]
        //     // Only performed after first set of Ids are calculated
        //     if (rangeIds.length > 0 && rangeEndId) {
        //       rangeIds.push([rangeEndId - 1, rangeStartId]);
        //       fetchNouns(rangeEndId - 1, rangeStartId);
        //     }
          
        //     const rangeCount: number = rangeStartId % rangeChunkSize;
        //     // End of range is either mod of chunk size from first itartion or chunk size
        //     rangeEndId = rangeStartId - (rangeCount || rangeChunkSize);
          
        //     // Push the beginning of the next range [(300-1) = 299, 200]
        //     rangeIds.push([rangeStartId - 1, rangeEndId]);
        //     fetchNouns(rangeStartId - 1, rangeEndId);
        //     // setRanges(range => [...range, [0, 50]]);
        //     // eslint-disable-next-line no-loop-func
        //     console.log('ranges', rangeIds, ranges);
        //     rangeStartId = rangeEndId - rangeChunkSize;
        //     console.log('rangeStartId = rangeEndId - rangeChunkSize;', rangeStartId, rangeEndId, rangeChunkSize)
            
        //   }
        // setRanges(rangeIds);
        // console.log("load these by noun.pics/:id", individualIds);
        // console.log("load these by noun.pics/range", rangeIds);
    };
    // console.log(nounsData.length, nounCount, initialCalls, nounsData);
    
    const [nouns, setNouns] = useState<NounPic[]>([]);
    // const [nounsList, setNounsList] = useState<NounPic[]>([]);
    const fetchNouns = async (start: number, end: number) => {
        // console.log('fetchNouns', start, end);
        const url = `https://noun.pics/range?start=${start}&end=${end}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            // const reverseOrder = json.reverse().map((noun: any, i: any) => noun);
            // console.log('json', json);
            // setNouns(reverseOrder);
            // setNouns(arr => [...arr, ...json]);
            // console.log(nouns);
            return json;
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
        nounCount >= 0 && rangeCalls(nounCount);
        console.log('trigger by nounCount', nounCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nounCount]);
    
    // useEffect(() => {
    //     // setRanges(ranges.reverse().map((id, i) => ([id[1], id[0]])));
    //     // console.log('ranges', ranges)
    //     if (sortOrder === "date-descending") {
    //         setNounsList(nouns.reverse());
    //     } else {
    //         setNounsList(nouns);
    //     }
        
    // }, [nouns, sortOrder]);
    
    // console.log("load these by noun.pics/range", rangeIds, ranges);
    // console.log("individual nouns", individualCount, individualNouns);
    
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
                        className={cx(
                            classes.exploreGrid, 
                            // isFullView && classes.fullViewGrid, 
                            // !isMobile && classes[activeSizeOption]
                        )}> 
                            <ul>       
                                {sortOrder === "date-descending" && (
                                    individualNouns.map((nounId, i) => {
                                        return (
                                            <>
                                                <ExploreGridItem 
                                                    nounId={nounId}
                                                    selectedNoun={selectedNoun}
                                                    setActiveNoun={setActiveNoun}
                                                    isKeyboardNavigating={isKeyboardNavigating}
                                                    handleOnFocus={handleOnFocus}
                                                />
                                            </>
                                        )
                                    })
                                )}
                                        
                                        {nouns.map((noun, i) => {
                                            return (
                                                <>
                                                    <ExploreGridItem 
                                                        nounId={noun.id}
                                                        imgSrc={noun.svg}
                                                        selectedNoun={selectedNoun}
                                                        setActiveNoun={setActiveNoun}
                                                        isKeyboardNavigating={isKeyboardNavigating}
                                                        handleOnFocus={handleOnFocus}
                                                    />
                                                </>
                                            )
                                        })}
                                    {sortOrder === "date-ascending" && (
                                        individualNouns.map((nounId, i) => {
                                            return (
                                                <>
                                                    <ExploreGridItem 
                                                        nounId={nounId}
                                                        selectedNoun={selectedNoun}
                                                        setActiveNoun={setActiveNoun}
                                                        isKeyboardNavigating={isKeyboardNavigating}
                                                        handleOnFocus={handleOnFocus}
                                                    />
                                                </>
                                            )
                                        }).reverse()
                                    )}
                                        {/* 
                                        {ranges.reverse().map((range, i) => {
                                            return (
                                                <>
                                                    <NounItemsRange start={range[0]} end={range[1]} key={i}>    
                                                        <ExploreGridItem 
                                                            selectedNoun={selectedNoun}
                                                            setActiveNoun={setActiveNoun}
                                                            isKeyboardNavigating={isKeyboardNavigating}
                                                            handleOnFocus={handleOnFocus}
                                                        />
                                                    </NounItemsRange>
                                                </>
                                            )
                                        })} */}
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
