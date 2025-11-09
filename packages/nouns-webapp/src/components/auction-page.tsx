'use client';

import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { isNumber } from 'remeda';

import Auction from '@/components/auction';
import Documentation from '@/components/documentation';
import NounsIntroSection from '@/components/nouns-intro-section';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setOnDisplayAuctionNounId } from '@/state/slices/on-display-auction';
import { nounPath } from '@/utils/history';
import useOnDisplayAuction from '@/wrappers/on-display-auction';

type AuctionPageProps = object;

const AuctionPage: React.FC<AuctionPageProps> = () => {
  const { id: auctionId } = useParams<{ id: string }>();
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = Number(onDisplayAuction?.nounId);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Ensure we only early-return when lastAuctionNounId is nullish, not when it's 0
    if (lastAuctionNounId == null) return;
    if (auctionId === undefined) {
      if (onDisplayAuctionNounId === Number(lastAuctionNounId)) return;
      dispatch(setOnDisplayAuctionNounId(Number(lastAuctionNounId)));
      return;
    }

    if (
      !isNumber(Number(auctionId)) ||
      Number(auctionId) > lastAuctionNounId ||
      Number(auctionId) < 0
    ) {
      router.push(nounPath(lastAuctionNounId));
      return;
    }

    if (Number(auctionId) !== onDisplayAuctionNounId) {
      dispatch(setOnDisplayAuctionNounId(Number(auctionId)));
    }
  }, [auctionId, lastAuctionNounId, dispatch, router, onDisplayAuctionNounId]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  return (
    <>
      <Auction auction={onDisplayAuction} />
      <NounsIntroSection />
      <Documentation backgroundColor={backgroundColor} />
    </>
  );
};
export default AuctionPage;
