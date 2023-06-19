import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import classes from './Explore.module.css';
import cx from 'classnames';
import ExploreDetail from '../../components/ExploreGrid/ExploreDetail';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import { Auction as IAuction } from '../../wrappers/vrbsAuction';
import { useAppSelector } from '../../hooks';
import { useKeyPress } from '../../hooks/useKeyPress';
import ExploreNav from '../../components/ExploreGrid/ExploreNav';
import ExploreGrid from '../../components/ExploreGrid';

interface ExplorePageProps {}

type Vrb = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExplorePage: React.FC<ExplorePageProps> = props => {
  // Borrowed from /src/pages/Playground/VrbModal/index.tsx
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  // Get number of vrbs in existence
  const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
  const vrbCount = currentAuction ? BigNumber.from(currentAuction?.vrbId).toNumber() + 1 : -1;

  // Set state
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
  const [vrbsList, setVrbsList] = useState<Vrb[]>([]);
  const [selectedVrb, setSelectedVrb] = useState<number | undefined>(undefined);
  const [activeVrb, setActiveVrb] = useState<number>(-1);
  const [isVrbHoverDisabled, setIsVrbHoverDisabled] = useState<boolean>(false);
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
  const handleVrbNavigation = (direction: string) => {
    if (
      (sortOrder === 'date-ascending' && direction === 'next') ||
      (sortOrder === 'date-descending' && direction === 'prev')
    ) {
      setActiveVrb(activeVrb + 1);
      setSelectedVrb(activeVrb + 1);
    } else {
      setActiveVrb(activeVrb - 1);
      setSelectedVrb(activeVrb - 1);
    }
  };

  const handleSortOrderChange = (orderValue: string) => {
    setSortOrder(orderValue);
    if (sortOrder === 'date-ascending') {
      !isMobile && isSidebarVisible && setActiveVrb(vrbCount - 1);
      !isMobile && isSidebarVisible && setSelectedVrb(vrbCount - 1);
    } else {
      !isMobile && isSidebarVisible && setActiveVrb(0);
      !isMobile && isSidebarVisible && setSelectedVrb(0);
    }
  };

  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveVrb(-1);
    setSelectedVrb(undefined);
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

  const handleScrollTo = (vrbId: number) => {
    setIsVrbHoverDisabled(true);
    vrbId && buttonsRef.current[vrbId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusVrb = (vrbId: number) => {
    vrbId >= 0 && buttonsRef.current[vrbId]?.focus();
    setActiveVrb(vrbId);
    setSelectedVrb(vrbId);
    setIsSidebarVisible(true);
    if (isMobile) {
      const body = document.body;
      setScrollY(document.documentElement.style.getPropertyValue('--scroll-y'));
      body.style.top = `-${scrollY}`;
    }
  };

  useEffect(() => {
    setIsVrbHoverDisabled(true);
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

    if (selectedVrb !== undefined && selectedVrb >= 0) {
      if (keyboardEsc) {
        handleCloseDetail();
      }
      if (sortOrder === 'date-descending') {
        if (keyboardPrev && selectedVrb + 1 < vrbCount) {
          handleFocusVrb(selectedVrb + 1);
        }
        if (keyboardNext && selectedVrb - 1 >= 0) {
          handleFocusVrb(selectedVrb - 1);
        }
        if (keyboardUp && selectedVrb + amountToMove < vrbCount) {
          handleFocusVrb(selectedVrb + amountToMove);
        }
        if (keyboardDown && selectedVrb - amountToMove >= 0) {
          handleFocusVrb(selectedVrb - amountToMove);
        }
      } else {
        if (keyboardPrev && selectedVrb - 1 >= 0) {
          handleFocusVrb(selectedVrb - 1);
        }
        if (keyboardNext && selectedVrb + 1 < vrbCount) {
          handleFocusVrb(selectedVrb + 1);
        }
        if (keyboardUp && selectedVrb - amountToMove >= 0) {
          handleFocusVrb(selectedVrb - amountToMove);
        }
        if (keyboardDown && selectedVrb + amountToMove < vrbCount) {
          handleFocusVrb(selectedVrb + amountToMove);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, keyboardEsc]);

  // Once vrbCount is known, run dependent functions
  useEffect(() => {
    if (vrbCount >= 0) {
      // get latest vrb id, then replace loading sidebar state with latest vrb
      !isMobile && setSelectedVrb(BigNumber.from(currentAuction?.vrbId).toNumber());
      !isMobile && setActiveVrb(BigNumber.from(currentAuction?.vrbId).toNumber());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vrbCount]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Remove block on hover over vrb
    window.addEventListener('mousemove', event => {});
    onmousemove = () => {
      setIsVrbHoverDisabled(false);
    };
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div className={classes.exploreWrap} ref={containerRef}>
      <div className={classes.contentWrap}>
        <motion.div
          className={cx(classes.gridWrap, isVrbHoverDisabled && classes.vrbHoverDisabled)}
          animate={{
            maxWidth: !isMobile && selectedVrb ? '80%' : '100%',
            transition: {
              duration: 0.025,
            },
          }}
        >
          <ExploreNav
            vrbCount={vrbCount}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleSortOrderChange={handleSortOrderChange}
          />
          <ExploreGrid
            vrbCount={vrbCount}
            activeVrb={activeVrb}
            selectedVrb={selectedVrb}
            setActiveVrb={setActiveVrb}
            setSelectedVrb={setSelectedVrb}
            setVrbsList={setVrbsList}
            handleFocusVrb={handleFocusVrb}
            isVrbHoverDisabled={isVrbHoverDisabled}
            buttonsRef={buttonsRef}
            vrbsList={vrbsList}
            sortOrder={sortOrder}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <ExploreDetail
              handleCloseDetail={() => handleCloseDetail()}
              handleVrbNavigation={handleVrbNavigation}
              vrb={[...vrbsList].reverse()[activeVrb]}
              vrbId={activeVrb}
              vrbCount={vrbCount}
              selectedVrb={selectedVrb}
              isVisible={isSidebarVisible}
              handleScrollTo={handleScrollTo}
              setIsVrbHoverDisabled={setIsVrbHoverDisabled}
              disablePrev={
                (sortOrder === 'date-ascending' && activeVrb === 0) ||
                (sortOrder === 'date-descending' && activeVrb === vrbCount - 1)
                  ? true
                  : false
              }
              disableNext={
                (sortOrder === 'date-ascending' && activeVrb === vrbCount - 1) ||
                (sortOrder === 'date-descending' && activeVrb === 0)
                  ? true
                  : false
              }
              handleFocusVrb={handleFocusVrb}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ExplorePage;
