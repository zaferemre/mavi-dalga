//Import components
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div>
      {/* Transparent Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Additional Scrollable Content */}
      <div className="bg-gray-100 text-black p-12">
        <h2 className="text-4xl font-bold mb-4">More Content Here</h2>
        <p className="text-lg">
          Add your sections here. Scroll down to see the header change!
        </p>
      </div>
      <Footer />
    </div>
  );
}
