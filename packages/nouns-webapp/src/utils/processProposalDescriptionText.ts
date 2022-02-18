/**
 * Removes first occurence of proposalTitle from descriptionText
 * @param descriptionText The description field of a proposal object
 * @param proposalTitle  The title of the corresponding proposal
 * @returns The proposal description with the first occurence of the title string removed
 */
export const processProposalDescriptionText = (descriptionText: string, proposalTitle: string) => {
  return descriptionText.replace(proposalTitle, '');
};
