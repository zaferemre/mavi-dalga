import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Wave from "react-wavify";
import MDBlogView from "../../components/mdblog/MDBlogView";
import { client } from "../../sanity/lib/client";

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  description?: string;
  mainImage?: { asset?: { url?: string }; alt?: string };
  author?: { name?: string; image?: { asset?: { url?: string } } };
  categories?: { title: string }[];
  tags?: string[];
};

const PAGE_SIZE = 24;

export async function getStaticProps() {
  try {
    const posts: Post[] = await client.fetch(`
      *[_type == "post" && defined(publishedAt)]
        | order(publishedAt desc)[0...${PAGE_SIZE}]{
        _id,
        title,
        slug,
        publishedAt,
        description,
        mainImage{
          asset->{ url },
          alt
        },
        author->{
          name,
          image{ asset->{ url } }
        },
        categories[]->{ title },
        "tags": coalesce(tags[]->title, tags)
      }`);

    return {
      props: { posts: Array.isArray(posts) ? posts : [] },
      revalidate: 60, // ISR
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { props: { posts: [] }, revalidate: 60 };
  }
}

export default function MDBlogPage({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen text-black relative">
      <Header />

      {/* Wave header keeps your vibe */}
      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{ height: 20, amplitude: 20, speed: 0.2, points: 4 }}
          style={{ width: "100%", height: "10rem" }}
        />
      </div>

      <MDBlogView posts={posts} />

      <Footer />
    </div>
  );
}
