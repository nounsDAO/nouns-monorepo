/**
 * Create a slug for a candidate page from the proposer's address and slug
 * format: `0x1234...5678-slug`
 * @param proposer
 * @param slug
 */
export const buildCandidateSlug = (proposer: string, slug: string) => {
  return `${proposer.toLowerCase()}-${slug.replace(/\s+/g, '-').toLowerCase()}`;
};
