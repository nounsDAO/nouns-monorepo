/**
 * Given state, picks the stateResult that corresponses to state
 */
export const usePickByState = (state: any, states: any[], stateResults: any[]): any => {
  return stateResults[states.indexOf(state)];
};
