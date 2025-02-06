import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  if (!post || !post.slug?.current) {
    console.error("Post is missing required fields:", post);
    return null; // Prevents errors if slug is missing
  }

  return (
    <div className="overflow-hidden rounded-lg shadow-sm bg-white dark:bg-[#090E1A]">
      <Link href={`/mdblog/${post.slug.current}`}>
        {/* Post Image */}
        <div className="relative h-48 w-full">
          {post.mainImage?.asset?.url ? (
            <Image
              src={post.mainImage.asset.url}
              alt={post.title || "Post image"}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          ) : (
            <div className="bg-gray-200 h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {post.title || "Untitled Post"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {post.description || "No description available."}
          </p>

          {/* Author Info */}
          <div className="mt-4 flex items-center">
            {post.author?.image?.asset?.url ? (
              <Image
                src={post.author.image.asset.url}
                alt={post.author.name || "Author"}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm text-gray-500">
                ?
              </div>
            )}
            <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {post.author?.name || "Unknown Author"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
