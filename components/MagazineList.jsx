import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const LoaderRow = () => (
  <div
    className="w-full flex items-center justify-center gap-3 mb-6"
    role="status"
    aria-live="polite"
  >
    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
    <span className="text-sm text-gray-600 font-medium">Yükleniyor…</span>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
    <div className="relative w-full aspect-[3/4]">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
    </div>
    <div className="p-3">
      <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse mx-auto" />
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-3 text-5xl">⚠️</div>
    <h3 className="text-xl font-semibold mb-2">Couldn’t load the archive</h3>
    <p className="text-gray-600 mb-4">Please try again.</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 transition"
    >
      Retry
    </button>
  </div>
);

const MagazineList = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // simple image error fallback map
  const [broken, setBroken] = useState({}); // {index: true}

  const loadMagazines = async () => {
    try {
      setErr("");
      setLoading(true);
      const response = await axios.get("/api/magazines");
      // filter out items named "Arşiv Kapak"
      const data = (response.data || []).filter(
        (m) => (m?.name || "").trim().toLowerCase() !== "arşiv kapak"
      );
      setMagazines(data);
    } catch (e) {
      setErr(e?.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Arşivimiz
      </h2>

      {/* show loader after title, while cards load */}
      {loading && <LoaderRow />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : err ? (
          <ErrorState onRetry={loadMagazines} />
        ) : (
          magazines.map((magazine, index) => {
            const isBroken = broken[index];
            const thumb = isBroken
              ? "/default-thumbnail.jpeg"
              : magazine.thumbnail;

            return (
              <a
                key={index}
                href={magazine.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out rounded overflow-hidden">
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={thumb}
                      alt={magazine.name}
                      fill
                      className="object-cover group-hover:opacity-90"
                      onError={() =>
                        setBroken((b) => ({ ...b, [index]: true }))
                      }
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      priority={index < 3} // small perf touch for first row
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {magazine.name}
                    </h3>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MagazineList;
