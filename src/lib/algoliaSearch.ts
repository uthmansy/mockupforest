import { SearchParams, algoliasearch } from "algoliasearch";

// Only use the *search* key on the client
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export const algoliaResponse = async (searchParams: SearchParams) =>
  await searchClient.searchSingleIndex({
    indexName: "mockups_index",
    searchParams,
  });
