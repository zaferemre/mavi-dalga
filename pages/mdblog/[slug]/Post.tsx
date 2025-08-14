import React from "react";
import { PortableText, PortableTextBlockComponent } from "@portabletext/react";
import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Card, CardContent } from "../../../components/ui/Card";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src).auto("format");

/** Helper, treat blocks that only contain whitespace as empty */
function isEmptyPortableBlock(value: any): boolean {
  const kids = value?.children;
  if (!Array.isArray(kids) || kids.length === 0) return true;
  // if every child has empty or whitespace text, consider it empty
  return kids.every(
    (k: any) => typeof k?.text === "string" && k.text.replace(/\s+/g, "") === ""
  );
}

export default function Post({ post }: { post: any }) {
  if (!post) {
    return <p className="mt-10 text-center text-gray-500">Post not found.</p>;
  }

  const title = post?.title || "Untitled Post";
  const description = post?.description;
  const mainImage = post?.mainImage;
  const mainImageAlt = post?.mainImage?.alt || title;
  const body = post?.body || [];

  // Custom renderers
  const normalBlock: PortableTextBlockComponent = ({ children, value }) => {
    // Respect manual blank lines from the editor
    if (isEmptyPortableBlock(value)) {
      return <div aria-hidden className="h-6 sm:h-8" />;
    }
    return (
      <p className="mb-6 sm:mb-8 text-gray-800 text-justify [hyphens:auto]">
        {children}
      </p>
    );
  };

  return (
    <article className="w-full">
      <Card>
        <CardContent className="p-5 sm:p-8 lg:p-10">
          {/* Title and Deck */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-lg text-gray-700">{description}</p>
          )}

          {/* HERO image, editorial crop ok */}
          {mainImage && (
            <div className="relative mt-6 w-full bg-gray-100 overflow-hidden rounded-xl aspect-[16/9] sm:aspect-[21/9]">
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
              className="prose prose-gray mt-8 w-full !max-w-none mx-0
                         prose-headings:scroll-mt-24
                         prose-img:rounded-xl prose-img:shadow
                         prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                         prose-a:text-blue-600 hover:prose-a:underline
                         [&_li]:text-justify [&_li]:[hyphens:auto]
                         [&_figure]:mx-0 [&_blockquote]:mx-0"
              style={{
                maxWidth: "none",
                marginLeft: 0,
                marginRight: 0,
                textAlignLast: "auto",
              }}
            >
              <PortableText
                value={body}
                components={{
                  block: {
                    normal: normalBlock,
                    h2: ({ children }) => (
                      <h2 className="mt-10 mb-4 text-2xl sm:text-3xl font-semibold">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mt-8 mb-3 text-xl sm:text-2xl font-semibold">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 rounded-md bg-gray-50 p-4 italic">
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
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-800">
                        {children}
                      </code>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      // Body images, never crop
                      const url = urlFor(value).fit("max").url();
                      const alt = value?.alt || "Image";
                      const caption = value?.caption;

                      return (
                        <figure className="my-8">
                          <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
                            <Image
                              src={url}
                              alt={alt}
                              width={1600}
                              height={900}
                              className="h-auto w-full object-contain"
                              sizes="100vw"
                            />
                          </div>
                          {caption && (
                            <figcaption className="mt-2 text-center text-sm text-gray-500">
                              {caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="pl-6 list-disc">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="pl-6 list-decimal">{children}</ol>
                    ),
                  },
                }}
              />
            </div>
          ) : (
            <p className="mt-6 text-center text-gray-500">
              No content available.
            </p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
