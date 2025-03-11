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
  const mainImage = post?.mainImage;
  const mainImageAlt = post?.mainImage?.alt || title;
  const body = post?.body || [];

  return (
    <article className="mx-auto w-full max-w-screen-xl gap-5 md:grid-cols-4 md:pt-8 lg:gap-4 lg:px-20">
      <main className="md:col-span-3 mx-auto w-full">
        <Card>
          <CardContent className="p-10">
            {/* Title and Description */}
            <h1 className="text-left text-3xl font-bold break-words">
              {title}
            </h1>
            {description && (
              <p className="text-left text-lg my-4 break-words">
                {description}
              </p>
            )}

            {/* ✅ Display Main Image if Available */}
            {mainImage && (
              <div className="relative w-full h-[450px] my-8">
                <Image
                  src={builder.image(mainImage).width(1200).height(675).url()}
                  alt={mainImageAlt}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            {/* ✅ Render Blog Content with Quote Handling */}
            {body.length > 0 ? (
              <PortableText
                value={body}
                components={{
                  block: {
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold my-4 text-left break-words">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold my-4 text-left break-words">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => (
                      <p className="my-4 text-gray-700 text-left break-words">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="italic border-l-4 border-gray-400 pl-4  text-black bg-gray-50 p-3 rounded-md my-4">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    em: ({ children }) => (
                      <em className="italic font-normal text-[#4A4A4A]">
                        {children}
                      </em>
                    ), // ✅ Darker gray for readability
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    link: ({ value, children }) => (
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {children}
                      </a>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      return (
                        <div className="relative w-full h-[450px] my-8">
                          <Image
                            src={builder.image(value).url()}
                            alt={value.alt || "Blog Image"}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
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
