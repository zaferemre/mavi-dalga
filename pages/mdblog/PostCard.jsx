import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  if (!post || !post.slug?.current) return null;

  const img = post.mainImage?.asset?.url;
  const title = post.title || "Untitled Post";

  return (
    <div className="overflow-hidden rounded-lg shadow-sm bg-white">
      <Link href={`/mdblog/${post.slug.current}`}>
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          {img ? (
            <Image src={img} alt={title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            {post.description || "No description available."}
          </p>
        </div>
      </Link>
    </div>
  );
}
