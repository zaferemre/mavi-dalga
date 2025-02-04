export default function AdminHero({ children }) {
  return (
    <div className="relative h-screen bg-cover bg-center flex items-center justify-center text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url('/DCAAF849-9A9F-42D9-8EB3-A4DCBB0D9A6C_1_105_c.jpeg')`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-md">
        {children}
      </div>
    </div>
  );
}
