"use client";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const MDBlog = () => {
  const samplePosts = [
    {
      date: "2024-03-01",
      author: "John Smith",
      title: "Mastering Web Development in 2024",
      image:
        "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849822_960_720.jpg",
    },
    {
      date: "2024-02-15",
      author: "Alice Johnson",
      title: "10 Graphic Design Tips for Beginners",
      image:
        "https://cdn.pixabay.com/photo/2016/11/21/16/53/office-1846072_960_720.jpg",
    },
    {
      date: "2023-12-25",
      author: "Michael Foster",
      title: "How to Build a Brand Online",
      image:
        "https://cdn.pixabay.com/photo/2016/03/09/15/23/man-1246508_960_720.jpg",
    },
    {
      date: "2023-10-11",
      author: "Lindsay Walton",
      title: "Effective Content Marketing Strategies",
      image:
        "https://cdn.pixabay.com/photo/2015/11/19/21/11/typing-1050590_960_720.jpg",
    },
    {
      date: "2023-07-20",
      author: "Emily Carter",
      title: "Best Practices for Email Campaigns",
      image:
        "https://cdn.pixabay.com/photo/2018/03/30/08/17/workplace-3273347_960_720.jpg",
    },
    {
      date: "2023-06-15",
      author: "Tom Cook",
      title: "Tips to Enhance Your Work-Life Balance",
      image:
        "https://cdn.pixabay.com/photo/2020/05/06/20/55/technology-5136883_960_720.jpg",
    },
    {
      date: "2023-05-10",
      author: "Sarah Lee",
      title: "How AI is Changing Marketing",
      image:
        "https://cdn.pixabay.com/photo/2016/11/23/14/45/artificial-intelligence-1850832_960_720.jpg",
    },
    {
      date: "2022-11-25",
      author: "Emma Davis",
      title: "How to Optimize Your Website for SEO",
      image:
        "https://cdn.pixabay.com/photo/2017/12/10/14/47/web-3018383_960_720.jpg",
    },
    {
      date: "2022-10-01",
      author: "Chris Wilson",
      title: "Understanding the Basics of Blockchain",
      image:
        "https://cdn.pixabay.com/photo/2016/03/26/22/22/blockchain-1287142_960_720.jpg",
    },
    {
      date: "2022-07-15",
      author: "Sophia Roberts",
      title: "Photography Tips for Beginners",
      image:
        "https://cdn.pixabay.com/photo/2014/07/31/22/50/photographer-406032_960_720.jpg",
    },
    {
      date: "2022-05-30",
      author: "Liam Martinez",
      title: "How to Run a Successful Podcast",
      image:
        "https://cdn.pixabay.com/photo/2017/08/28/16/06/microphone-2685004_960_720.jpg",
    },
    {
      date: "2021-12-10",
      author: "Liam Walker",
      title: "Beginner's Guide to Python Programming",
      image:
        "https://cdn.pixabay.com/photo/2015/07/31/01/20/computer-869227_960_720.jpg",
    },
    {
      date: "2021-05-14",
      author: "David Thomas",
      title: "Building Scalable Web Applications",
      image:
        "https://cdn.pixabay.com/photo/2017/02/01/22/02/mobile-2035545_960_720.jpg",
    },
    {
      date: "2020-12-05",
      author: "Oliver Anderson",
      title: "Introduction to Cloud Computing",
      image:
        "https://cdn.pixabay.com/photo/2019/10/27/18/02/cloud-4583032_960_720.jpg",
    },
    {
      date: "2020-09-15",
      author: "Ella Perez",
      title: "How to Start a Blog in 2020",
      image:
        "https://cdn.pixabay.com/photo/2017/02/08/19/33/laptop-2055522_960_720.jpg",
    },
    {
      date: "2020-07-30",
      author: "Lucas White",
      title: "10 Tips for Better Time Management",
      image:
        "https://cdn.pixabay.com/photo/2015/07/31/22/50/photographer-869227_960_720.jpg",
    },
  ];

  const [visiblePosts, setVisiblePosts] = useState(samplePosts.slice(0, 6));
  const [hasMore, setHasMore] = useState(true);

  // Extract years dynamically for navigation
  const years = [
    ...new Set(samplePosts.map((post) => new Date(post.date).getFullYear())),
  ];

  // Load more posts for infinite scroll
  const loadMorePosts = () => {
    const nextPosts = samplePosts.slice(
      visiblePosts.length,
      visiblePosts.length + 6
    );
    setVisiblePosts((prev) => [...prev, ...nextPosts]);
    if (visiblePosts.length + nextPosts.length >= samplePosts.length) {
      setHasMore(false);
    }
  };

  // Scroll to the first post of a specific year
  const scrollToYear = (year) => {
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>

        {/* Year Navigation */}
        <div className="flex justify-center mt-6 space-x-4">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => scrollToYear(year)}
              className="px-4 py-2 bg-blue-500 text-white  hover:bg-blue-700"
            >
              {year}
            </button>
          ))}
        </div>

        {/* Infinite Scroll for Blog Posts */}
        <InfiniteScroll
          dataLength={visiblePosts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={<h4 className="text-center mt-6">Loading...</h4>}
          endMessage={
            <p className="text-center mt-6 text-gray-500">
              You've reached the end!
            </p>
          }
        >
          <div className="mt-10 grid gap-10 lg:grid-cols-3 sm:grid-cols-2">
            {visiblePosts.map((post, index) => (
              <div
                key={index}
                id={`year-${new Date(post.date).getFullYear()}`}
                className="relative group"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-56 w-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70  group-hover:opacity-80 transition duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm">{post.date}</p>
                  <p className="text-sm">{post.author}</p>
                  <h3 className="text-lg font-bold mt-2">{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MDBlog;
