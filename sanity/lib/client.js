// sanity/lib/client.js
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV !== "development", // Use CDN in production, not development
  // If you require token for drafts, add these lines:
  // token: process.env.SANITY_TOKEN, // Read token from environment variable
  // ignoreBrowserTokenWarning: true // Ignore browser token warning
});
