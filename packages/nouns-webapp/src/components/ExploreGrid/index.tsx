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
// import ExploreGridItem from './ExploreGridItem';

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
    // const [activeNounObject, setActiveNounObject] = useState<NounPic>({id: null, svg: undefined});
    // const [activeNounImg, setActiveNounImg] = useState<string>();

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
        // console.log('handleNounDetail');
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
                // containerRef.current?.scrollIntoView();
                containerRef.current && window.scrollTo(0, containerRef.current?.offsetTop);
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
    const containerRef = useRef<HTMLDivElement | null>(null);
    

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
        
        if ((sortOrder === "date-ascending")) {
            setActiveNoun(nounCount - 1);
            setSelectedNoun(nounCount - 1);
        } else {
            setActiveNoun(0);
            setSelectedNoun(0);
        }
    };

    type Noun = {
        id: number | null;
        imgSrc: string | undefined;
    };

    type NounPic = {
        id: number | null;
        svg: string | undefined;
    };

    
    // const [nouns, setNouns] = useState<NounPic[]>([]);
    // const [individualNouns, setIndividualNouns] = useState<NounPic[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [placeholderNouns, setPlaceholderNouns] = useState<Noun[]>([]);
    // const [listToDisplay, setListToDisplay] = useState<NounPic[]>([]);
    const [nounsList, setNounsList] = useState<Noun[]>([]);
    // const [individualNouns, setIndividualNouns] = useState<Noun[]>([]);
    // const [isNounsDataLoaded, setIsNounsDataLoaded] = useState<boolean>(false)

    // Set empty nouns to display grid while images are fetched
    const placeholderNoun: Noun = {id: null, imgSrc: undefined};
    useEffect(() => {
        const placeholderNounsData = new Array(250).fill(placeholderNoun).map((x, i): Noun => {
            return {
                id: null,
                imgSrc: undefined,
            }
        });
        // setPlaceholderNouns(placeholderNounsData);
        setNounsList(placeholderNounsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch initial nouns by url
    const getInitialNouns = (individualCount: number) => {
        const individualNouns = new Array(individualCount).fill(placeholderNoun).map((x, i): Noun => {
            return {
                id: i + (nounCount - individualCount),
                imgSrc: `https://noun.pics/${i + (nounCount - individualCount)}.svg`,
            }
        }).reverse();

        // Add initial nouns to end of placeholder array to 
        // display them first on load
        setNounsList(arr => [...arr, ...individualNouns]);
        // setIndividualNouns(individualNouns);
        
        // After initial nouns are set, run range calls
        rangeCalls(nounCount, individualNouns);
    }
    
    // Prep range calls
    const initialChunkSize = 10;
    const [individualCount, setIndividualCount] = useState<number>(initialChunkSize);    
    // const [orderedNouns, setOrderedNouns] = useState<NounPic[]>([]);
    const rangeCalls = async (nounCount: number, individualNouns: Noun[]) => {        
        if (nounCount >= 0) {
            // keep initial nouns, clear others and replace with ranges
            console.log('individualNouns in rangecalls', individualNouns)
            setNounsList(individualNouns);
            const rangeChunkSize = 100;
            for (let i = nounCount - individualCount; i >= 0; i -= (rangeChunkSize)) {
                const start = i - rangeChunkSize < 0 ? 0 : i - rangeChunkSize;
                const end = i - 1;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const nounsRange = await fetchNouns(start, end);
            }
        }
        // setOrderedNouns(listToDisplay.reverse());
    };    
    const fetchNouns = async (start: number, end: number) => {
        const url = `https://noun.pics/range?start=${start}&end=${end}`;
        try {
            const response = await fetch(url);
            const json = await response.json();

            // Convert noun.pic svg key to generic imgSrc key
            const rangeNouns: Noun[] = json.reverse().map((noun: NounPic, i: number) => {
                return {
                    id: noun.id,
                    imgSrc: noun.svg
                }
            });
            setNounsList(arr => [...arr, ...rangeNouns]);
            return rangeNouns;
        } catch (error) {
            console.log("error", error);
        }
    };
    

    useEffect(() => {
        if (nounCount >= 0) {
            getInitialNouns((nounCount % initialChunkSize) + 1);
            setIndividualCount((nounCount % initialChunkSize) + 1);
            // rangeCalls(nounCount);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nounCount]);

    
    // console.log('listToDisplay', listToDisplay);


    // const handleButtonRef = (el: HTMLButtonElement, nounId: number) => {
    //     buttonsRef.current[nounId] = el
    //     console.log('handleButtonRef');
    // }
    
    // const testRef = useRef<(HTMLDivElement[] | null)>([])
    // const testRef = useRef<(HTMLButtonElement | null)[]>([])
    
    // Console logs 
    useEffect(() => {
        console.log('nounsList', nounsList)
    }, [nounsList]);
    
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
                                        {(sortOrder === "date-ascending" ? [...nounsList].reverse() : nounsList).map((noun, i) => {
                                            // let nounId: number | null = null;
                                            // let imgSrc: React.SetStateAction<string | undefined> = undefined; 
                                            // let index = sortOrder === "date-ascending" ? Math.abs(i - nounCount + 1) : i;

                                            // nounCount >= 0 && i < 8 && sortOrder === "date-descending" && setActiveNounImg(`https://noun.pics/${nounCount - 1 - i}.svg`);
                                            // console.log(listToDisplay[i], listToDisplay);
                                            // if (listToDisplay[index]) {
                                            //     nounId = listToDisplay[index].id;
                                            //     imgSrc = listToDisplay[index].svg;
                                            // }
                                            return (
                                                <>
                                                {/* <button id={`${nounId}`} 
                                                key={nounId}
                                                    // ref={el => testRef.current[i] = el}
                                                    ref={el => 
                                                            buttonsRef.current[nounId ? nounId : -1] = el
                                                    }
                                                >test</button> */}
                                                {/* <ExploreGridItem 
                                                    key={i}
                                                    nounId={nounId}
                                                    imgSrc={imgSrc}
                                                    selectedNoun={selectedNoun}
                                                    setActiveNoun={setActiveNoun}
                                                    isKeyboardNavigating={isKeyboardNavigating}
                                                    handleOnFocus={handleOnFocus}
                                                    // ref={el => buttonsRef.current[nounId] = el}
                                                    // ref={buttonsRef.current[index].nounId}
                                                    handleButtonRef={handleButtonRef}
                                                /> */}
                                                <li 
                                                    className={noun.id === selectedNoun ? classes.activeNoun : ''} 
                                                    key={i}
                                                >
                                                    <button 
                                                        ref={el => buttonsRef.current[noun.id ? noun.id : -1] = el}
                                                        key={`${i}${noun.id}`}
                                                        onMouseDown={(e) => (selectedNoun === noun.id && document.activeElement && parseInt(document.activeElement.id) === noun.id) && handleOnFocus(noun.id)}
                                                        onFocus={(e) => noun.id !== null && handleOnFocus(noun.id)}
                                                        onMouseOver={() => !isKeyboardNavigating && noun.id !== null && setActiveNoun(noun.id)} 
                                                        onMouseOut={() => selectedNoun !== undefined && setActiveNoun(selectedNoun)}
                                                        >
                                                            {noun.imgSrc ? (
                                                                <img 
                                                                    src={noun.imgSrc}
                                                                    alt={`Noun ${noun.id}`}
                                                                />
                                                            ) : (
                                                                <Placeholder xs={12} animation="glow" />
                                                            )}
                                                        
                                                        <p className={classes.nounIdOverlay}>
                                                            {noun.id}
                                                        </p>
                                                        {/* <StandaloneNounImage nounId={BigNumber.from(i)} /> */}
                                                    </button>
                                                </li>
                                            </>
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
                                nounImgSrc={[...nounsList].reverse()[activeNoun]?.imgSrc}
                                // nounImgSrc={'orderedNouns[activeNoun]?.svg'}
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
