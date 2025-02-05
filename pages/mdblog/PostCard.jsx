import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm bg-white dark:bg-[#090E1A]">
      <Link href={`/mdblog/${post.slug.current}`}>
        <div className="relative h-48 w-full">
          {post.mainImage?.asset?.url ? (
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="bg-gray-200 h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <p className="text-sm text-gray-600">{post.description}</p>
          <div className="mt-4 flex items-center">
            {post.author?.image?.asset?.url && (
              <Image
                src={post.author.image.asset.url}
                alt={post.author.name}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            )}
            <p className="ml-2 text-sm text-gray-600">{post.author?.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
