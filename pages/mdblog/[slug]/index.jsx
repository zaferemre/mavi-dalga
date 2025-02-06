import { sanityFetch } from "../../../sanity/lib/fetch"; // Import sanityFetch
import { postPathsQuery, postQuery } from "../../../sanity/lib/queries"; // Import queries
import { client } from "../../../sanity/lib/client"; // Sanity client
import Post from "./Post"; // Import Post component
import BlogLayout from "../../../components/BlogLayout"; // Import the layout
import PropTypes from "prop-types"; // Import PropTypes for validation

export const revalidate = 60; // Revalidate data every 60 seconds

// ✅ Fetch all slugs for static generation
export async function getStaticPaths() {
  try {
    const posts = await client.fetch(postPathsQuery);
    console.log("✅ Fetched posts for paths:", posts);

    if (!Array.isArray(posts)) {
      console.error("❌ Sanity returned invalid posts:", posts);
      return { paths: [], fallback: "blocking" };
    }

    const paths = posts
      .filter((post) => post?.slug?.current)
      .map((post) => ({
        params: { slug: post.slug.current },
      }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("❌ Error fetching post paths:", error);
    return { paths: [], fallback: "blocking" };
  }
}

// ✅ Fetch post data for each page
export async function getStaticProps({ params }) {
  try {
    if (!params?.slug) {
      console.error("❌ No slug provided in params");
      return { notFound: true };
    }

    const post = await sanityFetch({
      query: postQuery,
      params: { slug: params.slug },
    });

    if (!post || !post.title) {
      console.error("❌ Sanity returned invalid post data:", post);
      return { notFound: true };
    }

    console.log("✅ Successfully fetched post:", post);
    return {
      props: { post },
      revalidate: 10, // ISR (Incremental Static Regeneration)
    };
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    return { notFound: true };
  }
}

// ✅ Render the post page
export default function Page({ post }) {
  if (!post) {
    return <p className="text-center text-gray-500">Post not found.</p>;
  }

  return (
    <BlogLayout>
      <Post post={post} />
    </BlogLayout>
  );
}

// ✅ PropTypes validation
Page.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    mainImage: PropTypes.object,
    body: PropTypes.array,
  }),
};
