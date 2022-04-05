interface Vote {
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
}

/**
 * Helper function to transform response from graph into flat list of nounIds that voted supportDetailed for the given prop
 *
 * @param votes - Graph response for noun vote query
 * @param supportDetailed - The integer support value: against (0), for (1), or abstain (2)
 * @returns - flat list of nounIds that voted supportDetailed for the given prop
 */
export const getNounVotes = (votes: Vote[], supportDetailed: number) => {
  return votes.filter(v => v.supportDetailed === supportDetailed).flatMap(v => v.nounsRepresented);
};
