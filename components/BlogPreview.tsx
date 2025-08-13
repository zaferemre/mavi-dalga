"use client";

import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

type Blog = {
  _id: string;
  title: string;
  author?: string;
  authorImage?: string;
  publishedAt?: string;
  image?: string;
};

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: "2024-02-10",
});

const BlogPreview = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch<Blog[]>(
        `*[_type == "post"] | order(publishedAt desc)[0...3]{
          _id,
          title,
          "author": author->name,
          "authorImage": author->image.asset->url,
          publishedAt,
          "image": coalesce(mainImage.asset->url, "")
        }`
      )
      .then((data) => setBlogs(data ?? []))
      .catch(console.error);
  }, []);

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Bloglarımıza Göz Atın
        </h2>
        <p className="mt-2 text-gray-600">
          Her hafta yeni blog yazılarımızla arayı soğutmuyoruz.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
        {blogs.map((blog, idx) => (
          <motion.article
            key={blog._id}
            className="relative h-96 cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg"
            onClick={() => router.push("/mdblog")}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.07 }}
            whileHover={{ scale: 1.02 }}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.3), transparent), url(${
                blog.image || "/logoBig.webp"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={blog.title}
          >
            <div className="absolute inset-0" />
            <div className="absolute bottom-0 p-6 text-white">
              <p className="mb-2 text-sm">
                {(blog.publishedAt &&
                  new Date(blog.publishedAt).toLocaleDateString()) ||
                  ""}{" "}
                &middot; {blog.author || "Mavi Dalga"}
              </p>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
