export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: "url('/seashoreMain.jpg')",
      }}
    >
      {/* Centered Content */}
      <div className=" text-center px-4">
        <h1 className="text-4xl lg:text-6xl font-bold tracking-widest ">
          su çok güzel,
        </h1>
        <p className="mt-4 text-lg lg:text-3xl  tracking-widest font-light">
          gelsene!
        </p>
      </div>
    </div>
  );
}
