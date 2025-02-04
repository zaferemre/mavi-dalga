export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: "url('/eBLo8V0qo2IOjpeg.jpeg')",
      }}
    >
      {/* Centered Content */}
      <div className=" text-center px-4">
        <h1 className="text-4xl lg:text-6xl font-bold tracking-widest uppercase">
          FAKİR TOMMO WAS HERE
        </h1>
        <p className="mt-4 text-lg lg:text-2xl uppercase tracking-widest font-light">
          AND LULI
        </p>
      </div>
    </div>
  );
}
