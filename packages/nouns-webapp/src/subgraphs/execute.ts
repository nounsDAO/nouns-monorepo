import config from "@/config"
import { TypedDocumentString } from "@/subgraphs/graphql"

export async function execute<TResult, TVariables>(
    query: TypedDocumentString<TResult, TVariables>,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
    const response = await fetch(config.app.subgraphApiUri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/graphql-response+json'
        },
        body: JSON.stringify({
            query,
            variables
        })
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return (await response.json()).data as TResult
}