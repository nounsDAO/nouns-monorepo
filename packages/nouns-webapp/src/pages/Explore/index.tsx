import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import classes from './Explore.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../../components/ExploreGrid/ExploreNounDetail';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import { useAppSelector } from '../../hooks';
import dotenv from 'dotenv';
import { useKeyPress } from '../../hooks/useKeyPress';
import ExploreNav from '../../components/ExploreGrid/ExploreNav';
import ExploreGrid from '../../components/ExploreGrid';
dotenv.config();

interface ExplorePageProps {}

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExplorePage: React.FC<ExplorePageProps> = props => {
  // Borrowed from /src/pages/Playground/NounModal/index.tsx
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
  };

  // Get number of nouns in existence
  const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
  const nounCount = currentAuction ? BigNumber.from(currentAuction?.nounId).toNumber() + 1 : -1;

  // Set state
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
  const [nounsList, setNounsList] = useState<Noun[]>([]);
  const [selectedNoun, setSelectedNoun] = useState<number | undefined>(undefined);
  const [activeNoun, setActiveNoun] = useState<number>(-1);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // // Keyboard keys to listen for
  const keyboardPrev: boolean = useKeyPress("ArrowLeft");
  const keyboardNext: boolean = useKeyPress("ArrowRight");
  const keyboardUp: boolean = useKeyPress("ArrowUp");
  const keyboardDown: boolean = useKeyPress("ArrowDown");
  const keyboardEsc: boolean = useKeyPress("Escape");
  
  // Handle events
  const handleNounNavigation = (direction: string) => {
    if ((sortOrder === "date-ascending" && direction === 'next') || (sortOrder === "date-descending" && direction === 'prev')) {
      setActiveNoun(activeNoun + 1);
      setSelectedNoun(activeNoun + 1);
    } else {
      setActiveNoun(activeNoun - 1);
      setSelectedNoun(activeNoun - 1);
    }
  }

  const handleSortOrderChange = (orderValue: string) => {
    setSortOrder(orderValue);
    if ((sortOrder === "date-ascending")) {
      setActiveNoun(nounCount - 1);
      setSelectedNoun(nounCount - 1);
    } else {
      setActiveNoun(0);
      setSelectedNoun(0);
    }
  }; 
  
  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveNoun(-1);
    setSelectedNoun(undefined);
  }

  // const handleNounDetail = (nounId: number) => {
  //   if (selectedNoun) {
  //       console.log('scrolling to noun', selectedNoun);
  //       handleScrollTo(nounId);
  //   }
  //   if (nounId === selectedNoun) {
  //       handleCloseDetail();
  //   } else {
  //       nounId > -1 && nounId < nounCount && setActiveNoun(nounId);
  //       nounId > -1 && nounId < nounCount && setSelectedNoun(nounId);  
  //       // setIsSidebarVisible(true)  
  //   }
  // }

  const handleScrollTo = (nounId: number) => {
    setIsKeyboardNavigating(true);
    nounId && buttonsRef.current[nounId]?.scrollIntoView({behavior: 'smooth'});
  };

  const handleFocusNoun = (nounId: number) => {
    console.log('handleFocusNoun', nounId);
    nounId >= 0 && buttonsRef.current[nounId]?.focus();
    setActiveNoun(nounId);
    setSelectedNoun(nounId);
    setIsSidebarVisible(true);
  };

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
                containerRef.current && window.scrollTo(0, containerRef.current?.offsetTop);
            }
            if (sortOrder === "date-descending") {
                if (keyboardPrev && (selectedNoun + 1 < nounCount)) {
                    handleFocusNoun(selectedNoun + 1);
                }
                if (keyboardNext && (selectedNoun - 1 >= 0)) {
                    handleFocusNoun(selectedNoun - 1);
                }
                if (keyboardUp && (selectedNoun + amountToMove < nounCount)) {
                    handleFocusNoun(selectedNoun + amountToMove);
                }
                if (keyboardDown && (selectedNoun - amountToMove >= 0)) {
                    handleFocusNoun(selectedNoun - amountToMove);
                }
            } else {
                if (keyboardPrev && (selectedNoun - 1 >= 0)) {
                    handleFocusNoun(selectedNoun - 1);
                }
                if (keyboardNext && (selectedNoun + 1 < nounCount)) {
                    handleFocusNoun(selectedNoun + 1);
                }
                if (keyboardUp && (selectedNoun - amountToMove >= 0)) {
                    handleFocusNoun(selectedNoun - amountToMove);
                }
                if (keyboardDown && (selectedNoun + amountToMove < nounCount)) {
                    handleFocusNoun(selectedNoun + amountToMove);
                }
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, keyboardEsc]);

  // Once nounCount is known, run dependent functions
  useEffect(() => {
    if (nounCount >= 0) {
      // get latest noun id, then replace loading sidebar state with latest noun
      !isMobile && setSelectedNoun(BigNumber.from(currentAuction?.nounId).toNumber());
      !isMobile && setActiveNoun(BigNumber.from(currentAuction?.nounId).toNumber());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nounCount]);

  useEffect(() => {
    handleScrollTo(selectedNoun || nounCount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarVisible])

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    // Remove block on hover over noun
    window.addEventListener('mousemove', (event) => {});
        onmousemove = () => { 
            setIsKeyboardNavigating(false);
        };
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    };
    
  }, []);
  return (
    <div className={classes.exploreWrap} ref={containerRef}>
      <div 
          className={classes.contentWrap}
          style={{
              overflow: isMobile && selectedNoun ? 'hidden' : 'visible'
          }}
          >
          <div 
              className={cx(
                classes.gridWrap,
                isKeyboardNavigating && classes.isKeyboardNavigating
              )}
          >
              <ExploreNav 
                nounCount={nounCount}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                handleSortOrderChange={handleSortOrderChange}
              />
              <ExploreGrid 
                nounCount={nounCount}
                activeNoun={activeNoun}
                selectedNoun={selectedNoun}
                setActiveNoun={setActiveNoun}
                setSelectedNoun={setSelectedNoun}
                setNounsList={setNounsList}
                handleFocusNoun={handleFocusNoun}
                isKeyboardNavigating={isKeyboardNavigating}
                buttonsRef={buttonsRef}
                nounsList={nounsList}
                sortOrder={sortOrder}
              />              
            </div>

            <AnimatePresence>
                {selectedNoun !== undefined && selectedNoun >= 0 && (
                    <ExploreNounDetail 
                        handleCloseDetail={() => handleCloseDetail()} 
                        handleNounNavigation={handleNounNavigation} 
                        nounId={activeNoun} 
                        nounImgSrc={[...nounsList].reverse()[activeNoun]?.imgSrc}
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
export default ExplorePage;
