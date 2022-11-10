import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import classes from './Explore.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../../components/ExploreGrid/ExploreNounDetail';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import { useAppSelector } from '../../hooks';
import { useKeyPress } from '../../hooks/useKeyPress';
import ExploreNav from '../../components/ExploreGrid/ExploreNav';
import ExploreGrid from '../../components/ExploreGrid';

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
  const [isNounHoverDisabled, setIsNounHoverDisabled] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [scrollY, setScrollY] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // // Keyboard keys to listen for
  const keyboardPrev: boolean = useKeyPress('ArrowLeft');
  const keyboardNext: boolean = useKeyPress('ArrowRight');
  const keyboardUp: boolean = useKeyPress('ArrowUp');
  const keyboardDown: boolean = useKeyPress('ArrowDown');
  const keyboardEsc: boolean = useKeyPress('Escape');

  // Handle events
  const handleNounNavigation = (direction: string) => {
    if (
      (sortOrder === 'date-ascending' && direction === 'next') ||
      (sortOrder === 'date-descending' && direction === 'prev')
    ) {
      setActiveNoun(activeNoun + 1);
      setSelectedNoun(activeNoun + 1);
    } else {
      setActiveNoun(activeNoun - 1);
      setSelectedNoun(activeNoun - 1);
    }
  };

  const handleSortOrderChange = (orderValue: string) => {
    setSortOrder(orderValue);
    if (sortOrder === 'date-ascending') {
      !isMobile && isSidebarVisible && setActiveNoun(nounCount - 1);
      !isMobile && isSidebarVisible && setSelectedNoun(nounCount - 1);
    } else {
      !isMobile && isSidebarVisible && setActiveNoun(0);
      !isMobile && isSidebarVisible && setSelectedNoun(0);
    }
  };

  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveNoun(-1);
    setSelectedNoun(undefined);
    !isMobile && window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (isMobile) {
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({
        top: parseInt(scrollY),
        behavior: 'auto',
      });
    }
  };

  const handleScrollTo = (nounId: number) => {
    setIsNounHoverDisabled(true);
    nounId && buttonsRef.current[nounId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusNoun = (nounId: number) => {
    nounId >= 0 && buttonsRef.current[nounId]?.focus();
    setActiveNoun(nounId);
    setSelectedNoun(nounId);
    setIsSidebarVisible(true);
    if (isMobile) {
      const body = document.body;
      setScrollY(document.documentElement.style.getPropertyValue('--scroll-y'));
      body.style.top = `-${scrollY}`;
    }
  };

  useEffect(() => {
    setIsNounHoverDisabled(true);
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
        handleCloseDetail();
      }
      if (sortOrder === 'date-descending') {
        if (keyboardPrev && selectedNoun + 1 < nounCount) {
          handleFocusNoun(selectedNoun + 1);
        }
        if (keyboardNext && selectedNoun - 1 >= 0) {
          handleFocusNoun(selectedNoun - 1);
        }
        if (keyboardUp && selectedNoun + amountToMove < nounCount) {
          handleFocusNoun(selectedNoun + amountToMove);
        }
        if (keyboardDown && selectedNoun - amountToMove >= 0) {
          handleFocusNoun(selectedNoun - amountToMove);
        }
      } else {
        if (keyboardPrev && selectedNoun - 1 >= 0) {
          handleFocusNoun(selectedNoun - 1);
        }
        if (keyboardNext && selectedNoun + 1 < nounCount) {
          handleFocusNoun(selectedNoun + 1);
        }
        if (keyboardUp && selectedNoun - amountToMove >= 0) {
          handleFocusNoun(selectedNoun - amountToMove);
        }
        if (keyboardDown && selectedNoun + amountToMove < nounCount) {
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
    window.addEventListener('resize', handleWindowSizeChange);
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Remove block on hover over noun
    window.addEventListener('mousemove', event => {});
    onmousemove = () => {
      setIsNounHoverDisabled(false);
    };
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div className={classes.exploreWrap} ref={containerRef}>
      <div className={classes.contentWrap}>
        <motion.div
          className={cx(classes.gridWrap, isNounHoverDisabled && classes.nounHoverDisabled)}
          animate={{
            maxWidth: !isMobile && selectedNoun ? '80%' : '100%',
            transition: {
              duration: 0.025,
            },
          }}
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
            isNounHoverDisabled={isNounHoverDisabled}
            buttonsRef={buttonsRef}
            nounsList={nounsList}
            sortOrder={sortOrder}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <ExploreNounDetail
              handleCloseDetail={() => handleCloseDetail()}
              handleNounNavigation={handleNounNavigation}
              noun={[...nounsList].reverse()[activeNoun]}
              nounId={activeNoun}
              nounCount={nounCount}
              selectedNoun={selectedNoun}
              isVisible={isSidebarVisible}
              handleScrollTo={handleScrollTo}
              setIsNounHoverDisabled={setIsNounHoverDisabled}
              disablePrev={
                (sortOrder === 'date-ascending' && activeNoun === 0) ||
                (sortOrder === 'date-descending' && activeNoun === nounCount - 1)
                  ? true
                  : false
              }
              disableNext={
                (sortOrder === 'date-ascending' && activeNoun === nounCount - 1) ||
                (sortOrder === 'date-descending' && activeNoun === 0)
                  ? true
                  : false
              }
              handleFocusNoun={handleFocusNoun}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ExplorePage;
