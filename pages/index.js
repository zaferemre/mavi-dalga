//Import components
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import BlogPreview from "../components/BlogPreview";
import FeatureSec from "../components/FeatureSec";
import CTA from "../components/CTA";
import Bento from "../components/Bento";
import Content from "../components/Content";
export default function Home() {
  return (
    <div>
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
