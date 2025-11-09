/**
 * Given state, picks the stateResult that corresponses to state
 */
export const usePickByState = <T, R>(state: T, states: T[], stateResults: R[]): R | undefined => {
  return stateResults[states.indexOf(state)];
};
