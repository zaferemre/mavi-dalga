import Header from "../../components/Header";
import Footer from "../../components/Footer";

import React from "react";
import Wave from "react-wavify";
import Hakkimizda from "./Hakkimizda";
import Ekibimiz from "./Ekibimiz";

const Home = () => {
  return (
    <div className="min-h-screen text-black relative">
      {/* Header */}
      <div className="">
        <Header />

        {/* Wave Background */}
        <div className="relative">
          <Wave
            fill="#fe5200"
            paused={false}
            options={{
              height: 20, // Reduce wave height for better integration
              amplitude: 20, // Smoothen the wave
              speed: 0.2,
              points: 4,
            }}
            style={{
              width: "100%",
              height: "10rem", // Limit wave height to prevent overlap
            }}
          />
        </div>
        <Hakkimizda />
        <Ekibimiz />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
