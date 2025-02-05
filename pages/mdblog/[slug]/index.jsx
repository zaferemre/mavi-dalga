import { sanityFetch } from "../../../sanity/lib/fetch";
import { postPathsQuery, postQuery } from "../../../sanity/lib/queries";
import { client } from "../../../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Post from "./Post";

export const revalidate = 60; // Revalidate data every 60 seconds

// This function generates the list of all the slugs for static generation of the post pages
export async function generateStaticParams() {
  const posts = await client.fetch(postPathsQuery);
  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// This function fetches the actual post data and renders the Post component
export default async function Page({ params }) {
  const post = await sanityFetch({ query: postQuery, params });

  // Render the Post component with the fetched post data
  return <Post post={post} />;
}
