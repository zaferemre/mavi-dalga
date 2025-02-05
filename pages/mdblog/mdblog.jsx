import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image for optimization
import { Card, CardContent } from "../../components/ui/Card"; // Assuming you're using a UI component library

const MDBlog = ({ posts }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Blog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.slug.current}
            className="overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <Link href={`/mdblog/${post.slug.current}`} className="block">
              {/* Blog Image */}
              {post.mainImage?.asset?.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.mainImage.alt || post.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              )}

              <CardContent className="pt-4">
                {/* Blog Title */}
                <h3 className="mb-2 font-semibold text-lg leading-6 text-gray-900 group-hover:text-gray-600">
                  {post.title}
                </h3>

                {/* Blog Description */}
                <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                  {post.description || "Read more..."}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-x-4">
                  {post.author?.image?.asset?.url && (
                    <Image
                      src={post.author.image.asset.url}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full bg-gray-50"
                      width={32}
                      height={32}
                    />
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {post.author?.name}
                    </p>
                    <time dateTime={post.publishedAt} className="text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MDBlog;
