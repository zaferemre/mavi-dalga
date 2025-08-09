import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";

const LoaderRow = () => (
  <div
    className="flex items-center gap-3 mb-6"
    role="status"
    aria-live="polite"
  >
    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
    <span className="text-sm text-gray-600 font-medium">Yükleniyor…</span>
  </div>
);

const SkeletonCard = () => (
  <div className="border rounded-lg overflow-hidden shadow-sm">
    <div className="relative w-full h-48 bg-gray-200">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
    </div>
    <div className="p-4">
      <div className="h-5 w-3/4 mb-2 rounded bg-gray-200 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const ArsivPage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");

  const categories = ["Tümü", "Teknoloji", "Felsefe", "Tasarım"];

  const fetchArchives = async () => {
    try {
      setErr("");
      setLoading(true);
      const response = await fetch("/api/archives");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setArchives(data);
    } catch (e) {
      setErr(e.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const filteredData = archives.filter(
    (item) =>
      (categoryFilter === "Tümü" || item.category === categoryFilter) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-black">
      <Header />
      <div
        className="container mx-auto px-4 py-8"
        aria-busy={loading ? "true" : "false"}
      >
        {/* Başlık HER ZAMAN önce gelir */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Arşivimiz</h1>

        {/* Filtre/Arama */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Arşivde ara..."
            className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tam burada: Başlıktan ve filtrelerden SONRA loading bilgisi */}
        {loading && <LoaderRow />}

        {/* Hata */}
        {!loading && err && (
          <div className="py-16 text-center">
            <div className="mb-3 text-5xl">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Bir sorun oluştu</h3>
            <p className="text-gray-600 mb-4">
              Arşivleri çekerken bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            <button
              onClick={fetchArchives}
              className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 transition"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          !err && (
            <>
              {filteredData.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-3 text-5xl">📚</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Bir şey bulamadık
                  </h3>
                  <p className="text-gray-600">
                    Aramanızı veya filtreyi değiştirerek tekrar
                    deneyebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredData.map((item) => (
                    <Link
                      key={item._id}
                      href={`/arsiv/${item._id}`}
                      className="block"
                    >
                      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={500}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                            {item.title}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {item.date} - {item.category}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ArsivPage;
