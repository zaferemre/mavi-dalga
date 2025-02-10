import { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import { PortableText } from "@portabletext/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import BlogPreview from "../components/BlogPreview";
import FeatureSec from "../components/FeatureSec";
import CTA from "../components/CTA";
import Bento from "../components/Bento";
import Content from "../components/Content";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: "2024-02-10",
});

export default function Home() {
  const [welcomeText, setWelcomeText] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchWelcomeText() {
      try {
        const data = await client.fetch(
          `*[_type == "welcomeText"][0]{title, body}`
        );
        if (data?.body) {
          setWelcomeText(data);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching welcomeText:", error);
      }
    }
    fetchWelcomeText();
  }, []);

  // Custom serializer for PortableText
  const portableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-white">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-semibold text-white">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-white">{children}</h3>
      ),
      normal: ({ children }) => (
        <p className="text-base text-white">{children}</p>
      ),
    },
    marks: {
      em: ({ children }) => <em className="italic">{children}</em>,
      strong: ({ children }) => (
        <strong className="font-bold">{children}</strong>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
      number: ({ children }) => (
        <ol className="list-decimal pl-5">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="text-white">{children}</li>,
      number: ({ children }) => <li className="text-white">{children}</li>,
    },
  };

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#fe5200] p-6 rounded-lg shadow-lg max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            {/* Render PortableText with proper formatting */}
            <div className="text-lg text-white">
              <PortableText
                value={welcomeText?.body}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transparent Header */}
      <Header />

      {/* Hero Section */}
      <Hero />
      <BlogPreview />
      <Content />
      <FeatureSec />
      <Bento />
      <CTA />

      <Footer />
    </div>
  );
}
