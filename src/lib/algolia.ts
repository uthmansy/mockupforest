import { algoliasearch } from "algoliasearch";
import { supabase } from "./supabaseClient";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_KEY as string
);

// Fetch and index objects in Algolia
export const indexAlgoliaRecords = async () => {
  const { data: datasetRequest, error } = await supabase
    .from("mockups")
    .select("*");

  if (error) throw error;

  algoliaClient.clearObjects({ indexName: "mockups_index" });

  return await algoliaClient.saveObjects({
    indexName: "mockups_index",
    objects: datasetRequest.map((data) => ({ ...data, objectID: data.id })),
  });
};

indexAlgoliaRecords()
  .then(() => console.log("Successfully indexed objects!"))
  .catch((err) => console.error(err));
