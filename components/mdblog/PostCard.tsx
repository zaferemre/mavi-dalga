"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Card, CardContent } from "../ui/Card";
import type { Post } from "./MDBlogView";

const spring = { type: "spring" as const, stiffness: 360, damping: 32 };

export default function PostCard({
  post,
  onOpen,
}: {
  post: Post;
  onOpen: (p: Post) => void;
}) {
  const title = post.title || "Untitled Post";
  const img = post.mainImage?.asset?.url;
  const alt = post.mainImage?.alt || title;
  const postCategories = post.categories?.map((c) => c.title) || [];
  const authorName = post?.author?.name || "Mavi Dalga Dergi";
  const authorImage = post?.author?.image?.asset?.url;
  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("tr-TR")
    : "Tarih yok";

  const id = post._id || post.slug?.current || title;

  return (
    <motion.div
      onClick={() => onOpen(post)}
      className="h-full cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition hover:shadow-md">
        {/* Shared element for layout transition */}
        <motion.div
          layoutId={`post-${id}-image`}
          transition={spring}
          className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100"
        >
          {img ? (
            <Image
              src={img}
              alt={alt}
              fill
              className="object-cover will-change-transform"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-400">
              No Image
            </div>
          )}

          {postCategories.length > 0 && (
            <div className="absolute right-2 top-2 flex flex-wrap gap-1">
              {postCategories.map((category) => (
                <span
                  key={category}
                  className="rounded bg-orange-600/90 px-2 py-1 text-xs font-medium text-white"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <CardContent className="flex flex-1 flex-col">
          <h3 className="line-clamp-2 text-lg font-semibold leading-6">
            {title}
          </h3>

          {post.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {post.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-x-3 pt-4">
            {authorImage ? (
              <Image
                src={authorImage}
                alt={authorName}
                className="rounded-full"
                width={28}
                height={28}
              />
            ) : (
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-300 text-xs text-gray-500">
                ?
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium">{authorName}</p>
              <time dateTime={post.publishedAt} className="text-gray-500">
                {date}
              </time>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
