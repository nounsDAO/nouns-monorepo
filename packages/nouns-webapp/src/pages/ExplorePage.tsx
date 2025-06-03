import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import ExploreGrid from '@/components/ExploreGrid';
import ExploreNav from '@/components/ExploreGrid/ExploreNav';
import ExploreNounDetail from '@/components/ExploreGrid/ExploreNounDetail';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { Auction as IAuction } from '@/wrappers/nounsAuction';

type ExplorePageProps = object;

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExplorePage: React.FC<ExplorePageProps> = () => {
  // Borrowed from /src/pages/Playground/NounModal/index.tsx
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  // Get number of nouns in existence
  const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
  const nounCount = currentAuction ? Number(BigInt(currentAuction?.nounId)) + 1 : -1;

  // Set state
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile);
  const [nounsList, setNounsList] = useState<Noun[]>([]);
  const [selectedNoun, setSelectedNoun] = useState<number | undefined>(undefined);
  const [activeNoun, setActiveNoun] = useState<number>(-1);
  const [isNounHoverDisabled, setIsNounHoverDisabled] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [scrollY, setScrollY] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

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
      if (!isMobile && isSidebarVisible) {
        setActiveNoun(nounCount - 1);
        setSelectedNoun(nounCount - 1);
      }
    } else {
      if (!isMobile && isSidebarVisible) {
        setActiveNoun(0);
        setSelectedNoun(0);
      }
    }
  };

  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveNoun(-1);
    setSelectedNoun(undefined);
    if (!isMobile) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (isMobile) {
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({
        top: Number(scrollY),
        behavior: 'auto',
      });
    }
  };

  const handleScrollTo = (nounId?: number) => {
    setIsNounHoverDisabled(true);
    if (nounId) {
      buttonsRef.current[nounId]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusNoun = (nounId: number) => {
    if (nounId >= 0) {
      buttonsRef.current[nounId]?.focus();
    }
    setActiveNoun(nounId);
    setSelectedNoun(nounId);
    setIsSidebarVisible(true);
    if (isMobile) {
      const body = document.body;
      setScrollY(document.documentElement.style.getPropertyValue('--scroll-y'));
      body.style.top = `-${scrollY}`;
    }
  };

  // Once nounCount is known, run dependent functions
  useEffect(() => {
    if (nounCount >= 0) {
      // get latest noun id, then replace loading sidebar state with latest noun
      if (!isMobile) {
        setSelectedNoun(
          currentAuction?.nounId !== undefined ? Number(BigInt(currentAuction.nounId)) : undefined,
        );
        setActiveNoun(
          currentAuction?.nounId !== undefined ? Number(BigInt(currentAuction.nounId)) : 0,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nounCount]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Remove block on hover over noun
    window.addEventListener('mousemove', () => {});
    onmousemove = () => {
      setIsNounHoverDisabled(false);
    };
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div
      className="mx-[3vw] rounded-[10px] border border-black/10 p-0 max-lg:mx-2 max-lg:border-0"
      ref={containerRef}
    >
      <div className="max-lg:z-2 flex justify-between max-lg:relative">
        <motion.div
          className={cn('z-2 relative w-full', isNounHoverDisabled && 'nounHoverDisabled')}
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
              }
              disableNext={
                (sortOrder === 'date-ascending' && activeNoun === nounCount - 1) ||
                (sortOrder === 'date-descending' && activeNoun === 0)
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
