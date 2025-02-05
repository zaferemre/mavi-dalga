import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MDBlog from "./mdblog";
import Wave from "react-wavify";
import { client } from "../../sanity/lib/client";

export async function getStaticProps() {
  const posts =
    await client.fetch(`*[_type == "post"] | order(publishedAt desc){
    title,
    slug,
    publishedAt,
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
    }
  }`);

  console.log("Fetched posts:", posts); // Debugging

  return {
    props: { posts },
    revalidate: 10, // ISR
  };
}

const Home = ({ posts }) => {
  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <div className="">
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

        {/* Blog Component */}
        <MDBlog posts={posts} />

        <Footer />
      </div>
    </div>
  );
};

export default Home;
