import React from "react";
import Link from "next/link";
import Image from "next/image"; // Next.js Image for optimization
import { Card, CardContent } from "../../components/ui/Card"; // UI Component Library

const MDBlog = ({ posts }) => {
  // ✅ Prevents `.map()` on undefined
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Blog</h1>
        <p className="text-center text-gray-500">No blog posts available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const postSlug = post?.slug?.current || null;
          const postTitle = post?.title || "Untitled Post";
          const postDescription = post?.description || "Read more...";
          const postImage = post?.mainImage?.asset?.url || null;
          const postAlt = post?.mainImage?.alt || postTitle;
          const authorName = post?.author?.name || "Unknown Author";
          const authorImage = post?.author?.image?.asset?.url || null;
          const postDate = post?.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : "Unknown Date";

          // ✅ Skip posts without a slug (prevents Next.js errors)
          if (!postSlug) return null;

          return (
            <Card
              key={postSlug}
              className="overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <Link href={`/mdblog/${postSlug}`} className="block">
                {/* Blog Image */}
                {postImage ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={postImage}
                      alt={postAlt}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}

                <CardContent className="pt-4">
                  {/* Blog Title */}
                  <h3 className="mb-2 font-semibold text-lg leading-6 text-gray-900 group-hover:text-gray-600">
                    {postTitle}
                  </h3>

                  {/* Blog Description */}
                  <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                    {postDescription}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-x-4">
                    {authorImage ? (
                      <Image
                        src={authorImage}
                        alt={authorName}
                        className="h-8 w-8 rounded-full bg-gray-50"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm text-gray-500">
                        ?
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {authorName}
                      </p>
                      <time
                        dateTime={post.publishedAt}
                        className="text-gray-500"
                      >
                        {postDate}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MDBlog;
