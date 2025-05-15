import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Wave from "react-wavify";

const discoColors = [
  "#ff00ff",
  "#00ffff",
  "#ffff00",
  "#ff5200",
  "#00ff00",
  "#ff0000",
];

const Home = () => {
  const [color, setColor] = useState("#ff00ff");

  useEffect(() => {
    const interval = setInterval(() => {
      const nextColor =
        discoColors[Math.floor(Math.random() * discoColors.length)];
      setColor(nextColor);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Wave */}
      <div className="absolute top-0 left-0 w-full">
        <Wave
          fill="#fe5200"
          paused={false}
          options={{ height: 20, amplitude: 20, speed: 0.15, points: 3 }}
          style={{ height: "5rem" }}
        />
      </div>

      {/* Spinning Disco Image */}
      <motion.img
        src="/fakir.jpeg"
        alt="Party Image"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="max-w-[90%] max-h-[80vh] rounded-2xl shadow-2xl"
        style={{
          border: `8px solid ${color}`,
          boxShadow: `0 0 40px ${color}`,
        }}
      />
    </div>
  );
};

export default Home;
