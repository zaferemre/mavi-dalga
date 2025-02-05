import { client } from "./client";

// Default values
const DEFAULT_PARAMS = {};
const DEFAULT_TAGS = [];

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}) {
  const isDraftMode = process.env.NODE_ENV === "development"; // Handle draft mode manually for pages
  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }

  const isDevelopment = process.env.NODE_ENV === "development";

  return client
    .withConfig({ useCdn: !isDevelopment }) // Disable CDN in development if needed
    .fetch(query, params, {
      ...(isDraftMode && {
        token: token,
        perspective: "previewDrafts", // Use preview drafts for draft mode
      }),
      next: {
        ...(isDraftMode && { revalidate: 30 }), // Revalidate after 30 seconds for drafts
        tags,
      },
    });
}
