import { useApolloClient } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { type DocumentNode, print } from 'graphql';

import config from '@/config';
import { completeNestedLists, fetchAllPages, SUBGRAPH_PAGE_SIZE } from '@/utils/subgraphPagination';

interface PaginationOptions {
  field: string;
  singleton?: boolean;
  nested?: {
    fields: string[];
    parentVariable?: string;
    parentIsList?: boolean;
    query?: DocumentNode;
    field?: string;
    singleton?: boolean;
  };
  pollInterval?: number;
  skip?: boolean;
}

/** Fetch complete lists before exposing data, including independently paged child lists. */
export function usePaginatedSubgraph<TData extends object>(
  query: DocumentNode,
  variables: Record<string, unknown>,
  options: PaginationOptions,
) {
  const client = useApolloClient();
  const { field, singleton, nested, pollInterval, skip } = options;
  const keyVariables = JSON.parse(
    JSON.stringify(variables, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  ) as Record<string, unknown>;
  const result = useQuery({
    queryKey: ['subgraph-pages', config.app.subgraphApiUri, print(query), keyVariables],
    enabled: skip !== true,
    refetchInterval: pollInterval != null && pollInterval > 0 ? pollInterval : false,
    queryFn: async ({ signal }) => {
      const request = async (pageVariables: Record<string, unknown>, document = query) => {
        const { data } = await client.query<Record<string, unknown>>({
          query: document,
          variables: { first: SUBGRAPH_PAGE_SIZE, skip: 0, nestedSkip: 0, ...pageVariables },
          fetchPolicy: 'no-cache',
          context: { fetchOptions: { signal } },
        });
        return data;
      };
      const complete = async (entity: Record<string, unknown>) => {
        if (!nested) return entity;
        return completeNestedLists(entity, nested.fields, async nestedSkip => {
          const parent = nested.parentVariable
            ? { [nested.parentVariable]: nested.parentIsList === true ? [entity.id] : entity.id }
            : {};
          const page = await request(
            { ...variables, ...parent, skip: 0, nestedSkip },
            nested.query,
          );
          const nestedField = nested.field ?? field;
          return (
            (nested.singleton ?? singleton) === true
              ? page[nestedField]
              : (page[nestedField] as unknown[])?.[0]
          ) as Record<string, unknown> | null;
        });
      };

      if (singleton === true) {
        const data = await request(variables);
        const entity = data[field] as Record<string, unknown> | null;
        return { ...data, [field]: entity ? await complete(entity) : null } as TData;
      }

      const records = await fetchAllPages(async pageSkip => {
        const data = await request({ ...variables, skip: pageSkip });
        return data[field] as Record<string, unknown>[];
      });
      // Only entities whose child list fills a page need additional requests.
      const completed = [];
      for (const entity of records) completed.push(await complete(entity));
      return { [field]: completed } as TData;
    },
  });

  return {
    data: result.data,
    loading: skip !== true && result.isPending,
    error: result.error ?? undefined,
    refetch: result.refetch,
  };
}
