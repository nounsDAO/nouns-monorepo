'use client';

import { usePathname } from 'next/navigation';

import { useAppSelector } from '@/hooks';

export const shouldUseStateBg = (location: { pathname: string }) => {
  return (
    location.pathname === '/' ||
    location.pathname.includes('/nouns') ||
    location.pathname.includes('/auction')
  );
};

/**
 * Utility function that takes three items and returns whichever one corresponds to the current
 * page state (white, cool, warm)
 * @param whiteState  What to return if the state is white
 * @param coolState  What to return if the state is cool
 * @param warmState  What to return is the state is warm
 * @returns item corresponding to current state
 */
export const useShouldUseStateBg = (): boolean => {
  const pathname = usePathname();
  return shouldUseStateBg({ pathname });
};

/**
 * Utility hook that takes three items and returns the one corresponding to the current page state.
 */
export const usePickByState = <T>(whiteState: T, coolState: T, warmState: T): T => {
  const useStateBg = useShouldUseStateBg();
  const isCoolState = useAppSelector(state => state.application.isCoolBackground);

  if (!useStateBg) {
    return whiteState;
  }
  return isCoolState ? coolState : warmState;
};
