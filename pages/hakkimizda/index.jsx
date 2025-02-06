import React, { Suspense, lazy } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Wave from "react-wavify";
import Hakkimizda from "./Hakkimizda";

// Lazy load the Server Component
const Ekibimiz = lazy(() => import("./Ekibimiz"));

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

        <Hakkimizda />

        {/* Wrap Ekibimiz in Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <Ekibimiz />
        </Suspense>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
