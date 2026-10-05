export const SUBGRAPH_PAGE_SIZE = 1_000;

export async function fetchAllPages<T>(
  fetchPage: (skip: number) => Promise<T[]>,
  pageSize = SUBGRAPH_PAGE_SIZE,
): Promise<T[]> {
  const records: T[] = [];
  for (;;) {
    const page = await fetchPage(records.length);
    records.push(...page);
    if (page.length < pageSize) return records;
  }
}

/** Each nested list has its own length; a short sibling must not stop a longer list. */
export async function completeNestedLists<T extends Record<string, unknown>>(
  entity: T,
  fields: string[],
  fetchPage: (skip: number) => Promise<T | null>,
  pageSize = SUBGRAPH_PAGE_SIZE,
): Promise<T> {
  const result: Record<string, unknown> = { ...entity };
  let page = entity;
  let skip = pageSize;
  while (fields.some(field => Array.isArray(page[field]) && page[field].length === pageSize)) {
    const next = await fetchPage(skip);
    if (!next) throw new Error('Subgraph entity disappeared while loading its lists');
    for (const field of fields) {
      result[field] = [
        ...(Array.isArray(result[field]) ? result[field] : []),
        ...(Array.isArray(next[field]) ? next[field] : []),
      ];
    }
    page = next;
    skip += pageSize;
  }
  return result as T;
}
