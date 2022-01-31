import { useAppSelector } from '../hooks';

export const shouldUseStateBg = (history: any) => {
  return (
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun') ||
    history.location.pathname.includes('/auction')
  );
};

/**
 * Utility function that takes three items and returns whichever one corresponds to the current
 * page state (white, cool, warm)
 * @param whiteState  What to return if the state is white
 * @param coolState  What to return if the state is cool
 * @param warmState  What to return is the state is warm
 * @param history  History object from useHistory
 * @returns item corresponding to current state
 */
export const usePickByState = (whiteState: any, coolState: any, warmState: any, history: any) => {
  const useStateBg = shouldUseStateBg(history);
  const isCoolState = useAppSelector(state => state.application.isCoolBackground);

  if (!useStateBg) {
    return whiteState;
  }
  if (isCoolState) {
    return coolState;
  }
  return warmState;
};
