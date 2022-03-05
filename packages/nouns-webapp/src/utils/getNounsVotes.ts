
/**
 * Helper function to transform response from graph into flat list of nounIds that voted supportDetailed for the given prop
 *
 * @param data - Graph response for noun vote query
 * @param supportDetailed - The integer support value: against (0), for (1), or abstain (2)
 * @returns - flat list of nounIds that voted supportDetailed for the given prop
 */
 export const getNounVotes = (data: any, supportDetailed: number) => {
    return data.proposals[0].votes
      .filter((vote: any) => vote.supportDetailed === supportDetailed)
      .map((vote: any) => vote.nouns)
      .flat(1)
      .map((noun: any) => noun.id);
  };