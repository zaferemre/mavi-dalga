import React from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../../sanity/lib/client"; // Sanity client for fetching data
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import BlogLayout from "../../../components/BlogLayout";
import { Card, CardContent } from "../../../components/ui/Card"; // Custom card component

// Initialize the image URL builder for Sanity
const builder = imageUrlBuilder(client);

// Fetch the data for the specific blog post based on the slug
export async function getStaticProps({ params }) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!post) {
    return { notFound: true }; // Return 404 if the post is not found
  }

  return {
    props: { post },
    revalidate: 10, // Enable Incremental Static Regeneration (ISR) with 10-second revalidation
  };
}

// Fetch all slugs for the blog posts to generate dynamic paths
export async function getStaticPaths() {
  const posts = await client.fetch(`*[_type == "post"]{ slug }`);
  const paths = posts.map((post) => ({
    params: { slug: post.slug.current },
  }));

  return { paths, fallback: "blocking" }; // Static generation for all posts
}

// Main Post Component
export default function Post({ post }) {
  return (
    <BlogLayout>
      <article className="mx-auto grid w-full max-w-screen-xl gap-5 px-0 pt-16 md:grid-cols-4 md:pt-24 lg:gap-4 lg:px-20">
        <main className="md:col-span-3">
          <Card>
            <CardContent className="p-10">
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <p>{post.description}</p>

              {/* Main Image */}
              {post.mainImage ? (
                <div className="-mx-10 my-8">
                  <Image
                    src={builder
                      .image(post.mainImage)
                      .width(1200)
                      .height(675)
                      .url()}
                    alt={post.mainImage?.alt || ""}
                    width={1200}
                    height={675}
                    className="h-auto w-full"
                  />
                </div>
              ) : null}

              {/* Body Content */}
              {post.body && (
                <PortableText
                  value={post.body}
                  components={{
                    block: {
                      h2: createHeadingComponent("h2"),
                      h3: createHeadingComponent("h3"),
                    },
                    types: {
                      image: ({ value }) => {
                        const dimensions = decodeAssetId(value.asset._id);
                        return (
                          <Image
                            src={builder.image(value).width(800).url()}
                            alt={value.alt || ""}
                            width={dimensions?.width || 800}
                            height={dimensions?.height || 600}
                            className="h-auto w-full"
                          />
                        );
                      },
                    },
                    marks: {
                      link: ({ children, value }) => {
                        const href = value?.href;
                        return (
                          <Link
                            href={href}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {children}
                          </Link>
                        );
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </main>

        {/* Sidebar with Author Info */}
        <aside className="hidden md:block">
          <div className="sticky top-20">
            {/* Author Info */}
            <Card className="mb-4">
              <CardContent className="pt-6">
                <h3 className="mb-2 text-lg font-semibold">Written by</h3>
                <div className="flex items-center">
                  {post.authorImage && (
                    <Image
                      src={builder
                        .image(post.authorImage)
                        .width(40)
                        .height(40)
                        .url()}
                      alt={post.authorName ?? ""}
                      className="mr-3 h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                  <div>
                    <p className="font-medium">{post.authorName}</p>
                    {post.authorTwitter && (
                      <Link
                        href={`https://twitter.com/${post.authorTwitter}`}
                        className="text-sm text-gray-500"
                        target="_blank"
                      >
                        @{post.authorTwitter}
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </article>
    </BlogLayout>
  );
}

// Helper function to decode image asset ID for the image dimensions
const decodeAssetId = (id) => {
  const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/;
  const match = pattern.exec(id);
  if (!match) {
    console.error(`Invalid asset ID: ${id}`);
    return null;
  }
  const [, assetId, dimensions] = match;
  const [width, height] = dimensions.split("x").map((v) => parseInt(v, 10));
  return { assetId, dimensions: { width, height } };
};

// Function to generate anchor ID for headings
const createHeadingComponent =
  (Tag) =>
  ({ children, value }) => {
    const text = extractTextFromPortableTextBlock(value);
    const id = slugify(text);
    return (
      <Tag id={id} className="group relative flex items-center">
        <Link href={`#${id}`} className="flex items-center">
          <span className="absolute left-0 -translate-x-full pr-2 opacity-0 transition-opacity group-hover:opacity-100">
            <LinkIcon className="size-4" />
          </span>
          {children}
        </Link>
      </Tag>
    );
  };
