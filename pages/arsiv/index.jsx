import React, { useState, useEffect } from "react";
import MagazineList from "../../components/MagazineList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Wave from "react-wavify";
import { FaArrowUp } from "react-icons/fa";

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
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
        <MagazineList />
        <Footer />
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Home;
