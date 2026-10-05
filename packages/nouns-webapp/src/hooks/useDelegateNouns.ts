import type { Delegates } from '@/wrappers/subgraph';
import type { DocumentNode } from 'graphql';

import { usePaginatedSubgraph } from './usePaginatedSubgraph';

export function useDelegateNouns(
  query: DocumentNode,
  variables: Record<string, unknown>,
  options: { skip?: boolean } = {},
) {
  const multiple = 'delegates' in variables;
  return usePaginatedSubgraph<Delegates>(query, variables, {
    field: 'delegates',
    skip: options.skip,
    nested: {
      fields: ['nounsRepresented'],
      parentVariable: multiple ? 'delegates' : 'delegate',
      parentIsList: multiple,
    },
  });
}
