import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Wave from "react-wavify";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen text-black relative">
      <Header />

      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{ height: 20, amplitude: 20, speed: 0.2, points: 4 }}
          style={{ width: "100%", height: "10rem" }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-6">
        <div className="w-full mx-auto">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
