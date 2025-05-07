import React, { useEffect } from 'react';

import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Auction from '@/components/Auction';
import Documentation from '@/components/Documentation';
import NounsIntroSection from '@/components/NounsIntroSection';
import ProfileActivityFeed from '@/components/ProfileActivityFeed';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setOnDisplayAuctionNounId } from '@/state/slices/onDisplayAuction';
import { nounPath } from '@/utils/history';
import useOnDisplayAuction from '@/wrappers/onDisplayAuction';

type AuctionPageProps = object;

const AuctionPage: React.FC<AuctionPageProps> = () => {
  const { id: initialAuctionId } = useParams<{ id: string }>();
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = Number(onDisplayAuction?.nounId);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out-of-bounds noun path ids
      if (Number(initialAuctionId) > lastAuctionNounId || Number(initialAuctionId) < 0) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        navigate(nounPath(lastAuctionNounId));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on the first load
          dispatch(setOnDisplayAuctionNounId(Number(initialAuctionId)));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction, navigate]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionNounId != undefined && onDisplayAuctionNounId !== lastAuctionNounId ? (
        <ProfileActivityFeed nounId={onDisplayAuctionNounId} />
      ) : (
        <NounsIntroSection />
      )}
      <Documentation
        backgroundColor={
          onDisplayAuctionNounId == undefined || onDisplayAuctionNounId === lastAuctionNounId
            ? backgroundColor
            : undefined
        }
      />
    </>
  );
};
export default AuctionPage;
