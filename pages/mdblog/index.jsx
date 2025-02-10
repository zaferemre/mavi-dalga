import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MDBlog from "./mdblog";
import Wave from "react-wavify";
import { client } from "../../sanity/lib/client";

export async function getStaticProps() {
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc){
        title,
        slug,
        publishedAt,
        description,
        mainImage {
          asset -> {
            url
          },
          alt
        },
        author -> {
          name,
          image {
            asset -> {
              url
            }
          }
        },
        categories[]-> { title }
      }`);

    if (!Array.isArray(posts)) {
      console.error("Sanity returned an invalid posts structure:", posts);
      return { props: { posts: [] } };
    }

    return {
      props: { posts },
      revalidate: 10, // Enable ISR (Incremental Static Regeneration)
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { props: { posts: [] } };
  }
}

const Home = ({ posts }) => {
  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <Header />

      {/* Wave Background */}
      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{
            height: 20,
            amplitude: 20,
            speed: 0.2,
            points: 4,
          }}
          style={{
            width: "100%",
            height: "10rem",
          }}
        />
      </div>

      {/* Ensure MDBlog receives posts correctly */}
      {posts.length > 0 ? (
        <MDBlog posts={posts} />
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No blog posts available.
        </p>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
