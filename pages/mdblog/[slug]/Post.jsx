import React from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Card, CardContent } from "../../../components/ui/Card";
import BlogLayout from "../../../components/BlogLayout";

export default function Post({ post }) {
  if (!post) {
    return <p className="text-center text-gray-500 mt-10">Post not found.</p>;
  }

  const builder = imageUrlBuilder(client);
  const title = post?.title || "Untitled Post";
  const description = post?.description;
  const mainImage = post?.mainImage || null;
  const mainImageAlt = post?.mainImage?.alt || title;
  const body = post?.body || [];

  return (
    <article className="mx-auto w-full max-w-screen-xl gap-5 px-4 pt-16 md:grid-cols-4 md:pt-24 lg:gap-4 lg:px-20">
      <main className="md:col-span-3 mx-auto w-full">
        <Card>
          <CardContent className="p-10">
            {/* Title and Description */}
            <h1 className="text-left text-3xl font-bold">{title}</h1>
            <p className="text-left text-lg my-4">{description}</p>

            {/* ✅ Main Image (Using Your Preferred Format) */}
            {post.mainImage && (
              <div className="-mx-10 my-8">
                <Image
                  src={builder
                    .image(post.mainImage)
                    .width(1200)
                    .height(675)
                    .url()}
                  alt={mainImageAlt}
                  width={1200}
                  height={675}
                  className="h-auto w-full mx-auto"
                />
              </div>
            )}

            {/* Body content */}
            {body.length > 0 ? (
              <PortableText
                value={body}
                components={{
                  block: {
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold my-4 text-left">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold my-4 text-left">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => (
                      <p className="my-4 text-gray-700 text-left">{children}</p>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      return (
                        <Image
                          src={builder.image(value).url()}
                          alt={value.alt || ""}
                          width={1200}
                          height={675}
                          className="h-auto w-full mx-auto"
                        />
                      );
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center mt-6">
                No content available.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </article>
  );
}
