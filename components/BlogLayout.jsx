import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Wave from "react-wavify"; // Import Wave component

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <Header />

      {/* Wave Effect */}
      <div className="relative">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{
            height: 20,
            amplitude: 20,
            speed: 0.2,
            points: 4,
          }}
          style={{
            width: "100%",
            height: "10rem",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto sm:p-0 lg:p-6">
        {/* Center the content */}
        <div className="w-full mx-auto text-center">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
