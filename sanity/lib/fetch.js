// sanity/lib/fetch.js
import { client } from "./client";

export async function sanityFetch({ query, params = {} }) {
  try {
    const data = await client.fetch(query, params);
    return data || []; // Handle null or undefined data
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return []; // Or throw the error if you prefer
  }
}
