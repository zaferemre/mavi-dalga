import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import { useRouter } from "next/router";

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
});

const BlogPreview = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc)[0...3]{
          _id,
          title,
          "author": author->name,
          "authorImage": author->image.asset->url,
          publishedAt,
          "image": mainImage.asset->url
        }`
      )
      .then((data) => setBlogs(data))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Bloglarımıza Göz Atın
        </h2>
        <p className="text-gray-600 mt-2">
          Her hafta yeni blog yazılarımızla arayı soğutmuyoruz.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer transform hover:scale-105 transition duration-300 h-96"
            onClick={() => router.push("/mdblog")}
          >
            <div className="absolute inset-bu 0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <img
              src={blog.image || "/logoBig.webp"}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 p-6 text-white">
              <div className="flex items-center mb-2">
                <p className="text-sm">
                  {new Date(blog.publishedAt).toLocaleDateString()} &middot;{" "}
                  {blog.author}
                </p>
              </div>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
