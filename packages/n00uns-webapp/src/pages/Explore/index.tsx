import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import classes from './Explore.module.css';
import cx from 'classnames';
import ExploreN00unDetail from '../../components/ExploreGrid/ExploreN00unDetail';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import { Auction as IAuction } from '../../wrappers/n00unsAuction';
import { useAppSelector } from '../../hooks';
import { useKeyPress } from '../../hooks/useKeyPress';
import ExploreNav from '../../components/ExploreGrid/ExploreNav';
import ExploreGrid from '../../components/ExploreGrid';

interface ExplorePageProps {}

type N00un = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExplorePage: React.FC<ExplorePageProps> = props => {
  // Borrowed from /src/pages/Playground/N00unModal/index.tsx
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  // Get number of n00uns in existence
  const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
  const n00unCount = currentAuction ? BigNumber.from(currentAuction?.n00unId).toNumber() + 1 : -1;

  // Set state
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
  const [n00unsList, setN00unsList] = useState<N00un[]>([]);
  const [selectedN00un, setSelectedN00un] = useState<number | undefined>(undefined);
  const [activeN00un, setActiveN00un] = useState<number>(-1);
  const [isN00unHoverDisabled, setIsN00unHoverDisabled] = useState<boolean>(false);
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
  const handleN00unNavigation = (direction: string) => {
    if (
      (sortOrder === 'date-ascending' && direction === 'next') ||
      (sortOrder === 'date-descending' && direction === 'prev')
    ) {
      setActiveN00un(activeN00un + 1);
      setSelectedN00un(activeN00un + 1);
    } else {
      setActiveN00un(activeN00un - 1);
      setSelectedN00un(activeN00un - 1);
    }
  };

  const handleSortOrderChange = (orderValue: string) => {
    setSortOrder(orderValue);
    if (sortOrder === 'date-ascending') {
      !isMobile && isSidebarVisible && setActiveN00un(n00unCount - 1);
      !isMobile && isSidebarVisible && setSelectedN00un(n00unCount - 1);
    } else {
      !isMobile && isSidebarVisible && setActiveN00un(0);
      !isMobile && isSidebarVisible && setSelectedN00un(0);
    }
  };

  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveN00un(-1);
    setSelectedN00un(undefined);
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

  const handleScrollTo = (n00unId: number) => {
    setIsN00unHoverDisabled(true);
    n00unId && buttonsRef.current[n00unId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusN00un = (n00unId: number) => {
    n00unId >= 0 && buttonsRef.current[n00unId]?.focus();
    setActiveN00un(n00unId);
    setSelectedN00un(n00unId);
    setIsSidebarVisible(true);
    if (isMobile) {
      const body = document.body;
      setScrollY(document.documentElement.style.getPropertyValue('--scroll-y'));
      body.style.top = `-${scrollY}`;
    }
  };

  useEffect(() => {
    setIsN00unHoverDisabled(true);
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

    if (selectedN00un !== undefined && selectedN00un >= 0) {
      if (keyboardEsc) {
        handleCloseDetail();
      }
      if (sortOrder === 'date-descending') {
        if (keyboardPrev && selectedN00un + 1 < n00unCount) {
          handleFocusN00un(selectedN00un + 1);
        }
        if (keyboardNext && selectedN00un - 1 >= 0) {
          handleFocusN00un(selectedN00un - 1);
        }
        if (keyboardUp && selectedN00un + amountToMove < n00unCount) {
          handleFocusN00un(selectedN00un + amountToMove);
        }
        if (keyboardDown && selectedN00un - amountToMove >= 0) {
          handleFocusN00un(selectedN00un - amountToMove);
        }
      } else {
        if (keyboardPrev && selectedN00un - 1 >= 0) {
          handleFocusN00un(selectedN00un - 1);
        }
        if (keyboardNext && selectedN00un + 1 < n00unCount) {
          handleFocusN00un(selectedN00un + 1);
        }
        if (keyboardUp && selectedN00un - amountToMove >= 0) {
          handleFocusN00un(selectedN00un - amountToMove);
        }
        if (keyboardDown && selectedN00un + amountToMove < n00unCount) {
          handleFocusN00un(selectedN00un + amountToMove);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, keyboardEsc]);

  // Once n00unCount is known, run dependent functions
  useEffect(() => {
    if (n00unCount >= 0) {
      // get latest n00un id, then replace loading sidebar state with latest n00un
      !isMobile && setSelectedN00un(BigNumber.from(currentAuction?.n00unId).toNumber());
      !isMobile && setActiveN00un(BigNumber.from(currentAuction?.n00unId).toNumber());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n00unCount]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Remove block on hover over n00un
    window.addEventListener('mousemove', event => {});
    onmousemove = () => {
      setIsN00unHoverDisabled(false);
    };
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div className={classes.exploreWrap} ref={containerRef}>
      <div className={classes.contentWrap}>
        <motion.div
          className={cx(classes.gridWrap, isN00unHoverDisabled && classes.n00unHoverDisabled)}
          animate={{
            maxWidth: !isMobile && selectedN00un ? '80%' : '100%',
            transition: {
              duration: 0.025,
            },
          }}
        >
          <ExploreNav
            n00unCount={n00unCount}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleSortOrderChange={handleSortOrderChange}
          />
          <ExploreGrid
            n00unCount={n00unCount}
            activeN00un={activeN00un}
            selectedN00un={selectedN00un}
            setActiveN00un={setActiveN00un}
            setSelectedN00un={setSelectedN00un}
            setN00unsList={setN00unsList}
            handleFocusN00un={handleFocusN00un}
            isN00unHoverDisabled={isN00unHoverDisabled}
            buttonsRef={buttonsRef}
            n00unsList={n00unsList}
            sortOrder={sortOrder}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <ExploreN00unDetail
              handleCloseDetail={() => handleCloseDetail()}
              handleN00unNavigation={handleN00unNavigation}
              n00un={[...n00unsList].reverse()[activeN00un]}
              n00unId={activeN00un}
              n00unCount={n00unCount}
              selectedN00un={selectedN00un}
              isVisible={isSidebarVisible}
              handleScrollTo={handleScrollTo}
              setIsN00unHoverDisabled={setIsN00unHoverDisabled}
              disablePrev={
                (sortOrder === 'date-ascending' && activeN00un === 0) ||
                (sortOrder === 'date-descending' && activeN00un === n00unCount - 1)
                  ? true
                  : false
              }
              disableNext={
                (sortOrder === 'date-ascending' && activeN00un === n00unCount - 1) ||
                (sortOrder === 'date-descending' && activeN00un === 0)
                  ? true
                  : false
              }
              handleFocusN00un={handleFocusN00un}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ExplorePage;
