import React from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Card, CardContent } from "../../../components/ui/Card";

const builder = imageUrlBuilder(client);
const urlFor = (src) => builder.image(src).auto("format");

export default function Post({ post }) {
  if (!post) {
    return <p className="text-center text-gray-500 mt-10">Post not found.</p>;
  }

  const title = post?.title || "Untitled Post";
  const description = post?.description;
  const mainImage = post?.mainImage;
  const mainImageAlt = post?.mainImage?.alt || title;
  const body = post?.body || [];

  return (
    <article className="w-full">
      <Card>
        <CardContent className="p-5 sm:p-8 lg:p-10">
          {/* Title & Deck */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-700 mt-3">{description}</p>
          )}

          {/* HERO image (ok to crop, looks editorial) */}
          {mainImage && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 mt-6">
              <Image
                src={urlFor(mainImage)
                  .width(1600)
                  .height(900)
                  .fit("fillmax")
                  .url()}
                alt={mainImageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              />
            </div>
          )}

          {/* Body */}
          {body.length > 0 ? (
            <div
              className="prose prose-gray max-w-none mt-8
                            prose-headings:scroll-mt-24
                            prose-img:rounded-xl prose-img:shadow
                            prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                            prose-a:text-blue-600 hover:prose-a:underline"
            >
              <PortableText
                value={body}
                components={{
                  block: {
                    h2: ({ children }) => (
                      <h2 className="text-2xl sm:text-3xl font-semibold mt-10 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl sm:text-2xl font-semibold mt-8 mb-3">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => (
                      <p className="text-gray-800">{children}</p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="italic bg-gray-50 p-4 rounded-md my-6">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    em: ({ children }) => (
                      <em className="italic text-gray-700">{children}</em>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    link: ({ value, children }) => (
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                        {children}
                      </code>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      // Body images: NEVER crop
                      const url = urlFor(value).fit("max").url();
                      const alt = value?.alt || "Image";
                      const caption = value?.caption;

                      return (
                        <figure className="my-8">
                          <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden">
                            {/* Let image keep its natural ratio (no fixed height) */}
                            <Image
                              src={url}
                              alt={alt}
                              width={1600}
                              height={900}
                              className="w-full h-auto object-contain"
                              sizes="100vw"
                            />
                          </div>
                          {caption && (
                            <figcaption className="mt-2 text-sm text-gray-500 text-center">
                              {caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-6">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-6">{children}</ol>
                    ),
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6">
              No content available.
            </p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
