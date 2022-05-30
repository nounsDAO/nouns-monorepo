/**
 * Given state, picks the stateResult that corresponses to state
 */
export const usePickByState = (state: any, states: any[], stateResults: any[]): any => {
  return stateResults[states.indexOf(state)];
};

/**
 * states is an array with EXACTLY one true element ... returns corresponding stateResults
 * @param states
 * @param stateResults
 * @returns
 */
export const usePickByStateBoolean = (states: boolean[], stateResults: any[]) => {
  for (let i = 0; i < states.length; i++) {
    if (states[i]) {
      return stateResults[i];
    }
  }
};
