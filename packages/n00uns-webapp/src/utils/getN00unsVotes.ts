interface Vote {
  supportDetailed: 0 | 1 | 2;
  n00unsRepresented: string[];
}

/**
 * Helper function to transform response from graph into flat list of n00unIds that voted supportDetailed for the given prop
 *
 * @param votes - Graph response for n00un vote query
 * @param supportDetailed - The integer support value: against (0), for (1), or abstain (2)
 * @returns - flat list of n00unIds that voted supportDetailed for the given prop
 */
export const getN00unVotes = (votes: Vote[], supportDetailed: number) => {
  return votes.filter(v => v.supportDetailed === supportDetailed).flatMap(v => v.n00unsRepresented);
};
