import { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import { PortableText } from "@portabletext/react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import BlogPreview from "../../components/BlogPreview";
import FeatureSec from "../../components/FeatureSec";
import CTA from "../../components/CTA";
import Bento from "../../components/Bento";
import Content from "../../components/Content";
import Wave from "react-wavify";
import YayinIlkelerimizMain from "../../components/YayinIlkelerimiz";

export default function Home() {
  return (
    <div>
      <Header />
      {/* Wave Background */}
      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{ height: 20, amplitude: 20, speed: 0.2, points: 4 }}
          style={{ width: "100%", height: "10rem" }}
        />
      </div>
      <YayinIlkelerimizMain />
      <Footer />
    </div>
  );
}
