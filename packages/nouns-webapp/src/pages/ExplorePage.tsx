import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { ImageData } from '@noundry/nouns-assets';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { range } from 'remeda';

import { Noun } from '@/components/Noun';
import { Trait } from '@/components/Trait';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReadNounsTokenSeeds } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { useBreakpointValues } from '@/hooks/useBreakpointValues';
import { traitName } from '@/lib/traitName';
import { Auction as IAuction } from '@/wrappers/nounsAuction';
type ExplorePageProps = object;

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const currentAuction: IAuction | undefined = useAppSelector(state => state.auction.activeAuction);
  const currentAuctionNounId = currentAuction ? BigInt(currentAuction.nounId) : undefined;
  const nounCount = currentAuctionNounId ? Number(currentAuctionNounId) + 1 : -1;
  const [sortOrder, setSortOrder] =
    useState<(typeof sortOptions)[number]['value']>('date-descending');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nounsList = useMemo(() => range(0, nounCount).map(BigInt), [nounCount]);
  const [selectedNounId, setSelectedNounId] = useState<bigint | undefined>(currentAuctionNounId);

  useEffect(() => {
    if (selectedNounId == undefined && currentAuctionNounId != undefined) {
      setSelectedNounId(currentAuctionNounId);
    }
  }, [currentAuctionNounId, selectedNounId]);

  const sortOptions = [
    {
      label: 'Latest',
      value: 'date-descending',
    },
    {
      label: 'Oldest',
      value: 'date-ascending',
    },
  ];

  const { data: selectedNounSeed } = useReadNounsTokenSeeds({
    args: [selectedNounId!],
    query: {
      enabled: selectedNounId !== undefined,
      select: data => {
        if (!data) return null;
        return {
          background: Number(data[0]),
          body: Number(data[1]),
          accessory: Number(data[2]),
          head: Number(data[3]),
          glasses: Number(data[4]),
        };
      },
    },
  });

  // Fixed grid settings
  const ITEM_SIZE = 96; // Fixed 96px size for miniatures
  const GAP_SIZE = 6;

  // Calculate items per row based on fixed container width
  const itemsPerRow =
    useBreakpointValues({
      xl: 8,
      lg: 7,
      md: 4,
      sm: 3,
    }) ?? 8;
  const totalRows = Math.ceil(nounCount / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ITEM_SIZE + GAP_SIZE,
    overscan: 2,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: itemsPerRow,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ITEM_SIZE + GAP_SIZE,
    overscan: 2,
  });

  // Get the sorted nouns list
  const sortedNounsList = useMemo(() => {
    return sortOrder === 'date-ascending' ? nounsList : [...nounsList].reverse();
  }, [nounsList, sortOrder]);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedNounId !== undefined && e.key === 'Escape') {
        setSelectedNounId(undefined);
      }
      if (
        selectedNounId !== undefined &&
        e.key === 'ArrowRight' &&
        selectedNounId < BigInt(nounCount) - 1n
      ) {
        setSelectedNounId(selectedNounId != undefined ? selectedNounId + 1n : undefined);
      }
      if (selectedNounId !== undefined && e.key === 'ArrowLeft' && selectedNounId > 0n) {
        setSelectedNounId(selectedNounId != undefined ? selectedNounId - 1n : undefined);
      }
    },
    [selectedNounId, nounCount],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      layout
      className="border-border mx-auto mt-1 flex h-[665px] w-fit overflow-clip rounded-2xl border"
    >
      {/* Explore Container */}
      <div className="hidden h-full flex-grow flex-col justify-between sm:flex">
        {/* Explore NavBar */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <h3>
            <span>
              <Trans>Explore</Trans>
            </span>{' '}
            {nounCount >= 0 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <strong>{nounCount}</strong> Nouns
              </motion.span>
            )}
          </h3>
          <Select defaultValue={sortOrder} onValueChange={setSortOrder}>
            <motion.div layout>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
            </motion.div>

            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Explore Grid */}
        <motion.div
          layout
          ref={containerRef}
          className="w-fit flex-grow overflow-y-auto overscroll-contain !p-2 !pr-0 shadow-inner"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: `${columnVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => (
              <React.Fragment key={virtualRow.key}>
                {columnVirtualizer.getVirtualItems().map(virtualColumn => {
                  const itemIndex = virtualRow.index * itemsPerRow + virtualColumn.index;
                  if (itemIndex >= nounCount) return null;

                  const nounId = sortedNounsList[itemIndex];
                  return (
                    <div
                      key={nounId}
                      onClick={() => {
                        setSelectedNounId(nounId);
                      }}
                      data-selected={selectedNounId === nounId}
                      className="group absolute overflow-clip rounded-2xl shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg data-[selected=true]:scale-105"
                      style={{
                        left: `${virtualColumn.start}px`,
                        top: `${virtualRow.start}px`,
                        width: `${ITEM_SIZE}px`,
                        height: `${ITEM_SIZE}px`,
                        animationDelay: `${virtualColumn.index * 50}ms`,
                        animationFillMode: 'both',
                        animationName: 'fadeInUp',
                        animationDuration: '500ms',
                        animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      }}
                    >
                      <Noun
                        nounId={nounId != null ? BigInt(nounId) : undefined}
                        loadingNounFallback
                        minFallbackDuration={1000}
                        style={{
                          width: `${ITEM_SIZE}px`,
                          height: `${ITEM_SIZE}px`,
                        }}
                        className="bg-cool-background"
                      />
                      {selectedNounId === nounId && (
                        <div className="border-3 absolute inset-0 rounded-2xl border-black" />
                      )}
                      <span className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 rounded-sm bg-white px-1 text-xs font-semibold shadow-sm group-hover:block group-data-[selected=true]:block">
                        {nounId.toString()}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Selected Noun Details */}
      <motion.div layout className="border-border flex h-full flex-col border-l">
        <div
          className="flex h-full flex-col"
          style={{
            backgroundColor: `#${ImageData.bgcolors[selectedNounSeed?.background ?? 0]}`,
          }}
        >
          {/* Noun Image */}
          <Noun
            nounId={selectedNounId ? BigInt(selectedNounId) : undefined}
            loadingNounFallback
            className="bg-cool-background mx-auto size-[288px] object-cover"
          />

          {/* Noun Info Header */}
          <div className="bg-muted mx-2 flex items-center justify-between rounded-t-2xl px-3 py-2 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (selectedNounId !== undefined && selectedNounId > 0n) {
                  setSelectedNounId(selectedNounId - 1n);
                }
              }}
              disabled={selectedNounId === undefined || selectedNounId <= 0n}
              className="size-6 rounded-full"
            >
              ←
            </Button>
            <h2 className="mx-2 text-2xl font-bold">
              <Trans>Noun</Trans> {selectedNounId?.toString() ?? '...'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (selectedNounId !== undefined && selectedNounId < BigInt(nounCount - 1)) {
                  setSelectedNounId(selectedNounId + 1n);
                }
              }}
              disabled={selectedNounId === undefined || selectedNounId >= BigInt(nounCount - 1)}
              className="size-6 rounded-full"
            >
              →
            </Button>
          </div>

          {/* Traits List */}
          <div className="flex-grow border-t bg-white p-2">
            <ul className="space-y-1">
              {(['head', 'glasses', 'accessory', 'body', 'background'] as const).map(traitType => {
                const traitIndex = selectedNounSeed?.[traitType] ?? 0;

                const traitDisplayName = {
                  background: <Trans>Background</Trans>,
                  body: <Trans>Body</Trans>,
                  accessory: <Trans>Accessory</Trans>,
                  head: <Trans>Head</Trans>,
                  glasses: <Trans>Noggles</Trans>,
                }[traitType];

                return (
                  <li
                    key={traitType}
                    className="flex w-full items-center gap-2 border-b border-gray-200 pb-1 last:pb-0"
                  >
                    <Trait
                      type={traitType}
                      seed={traitIndex}
                      className="size-12 rounded-md"
                      style={{
                        backgroundColor: `#${ImageData.bgcolors[selectedNounSeed?.background ?? 0]}`,
                      }}
                    />
                    <div className="flex w-full flex-col">
                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">
                        {traitDisplayName}
                      </span>
                      <div>
                        <motion.span
                          className="max-w-20 whitespace-nowrap text-sm font-semibold"
                          // animate={{ x: ['0%', '-100%'] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatType: 'loop',
                          }}
                        >
                          {traitName(traitType, traitIndex)}
                        </motion.span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Go to auction link */}
            <div className="mt-1 text-center">
              <a
                href={`/noun/${selectedNounId}`}
                className="text-sm font-bold text-red-600 hover:text-red-800 hover:no-underline"
              >
                <Trans>Go to auction</Trans>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ExplorePage;
