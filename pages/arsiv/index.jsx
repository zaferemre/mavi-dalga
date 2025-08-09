import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Wave from "react-wavify";
import { FaArrowUp } from "react-icons/fa";

// Loading fallback (spinner + metin)
const Loader = () => (
  <div
    className="w-full flex flex-col items-center justify-center py-16 text-center gap-3"
    role="status"
    aria-live="polite"
  >
    <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
    <p className="text-sm text-gray-600 font-medium">Yükleniyor…</p>
  </div>
);

// MagazineList'i dinamik yükle, beklerken Loader göster
const MagazineList = dynamic(() => import("../../components/MagazineList"), {
  loading: () => <Loader />,
  ssr: false, // istemci tarafında yükle (spinner kesin görünür)
});

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <Header />

      {/* Wave Background */}
      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{ height: 20, amplitude: 20, speed: 0.2, points: 4 }}
          style={{ width: "100%", height: "10rem" }}
          aria-hidden="true"
        />
      </div>

      {/* İçerik */}
      <main className="container mx-auto px-4">
        <MagazineList />
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
          aria-label="Yukarı kaydır"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Home;
