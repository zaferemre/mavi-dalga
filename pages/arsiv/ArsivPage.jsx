import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Link from "next/link";
import Image from "next/image";

const ArsivPage = () => {
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");

  useEffect(() => {
    const fetchArchives = async () => {
      const response = await fetch("/api/archives");
      const data = await response.json();
      setArchives(data);
    };

    fetchArchives();
  }, []);

  const categories = ["Tümü", "Teknoloji", "Felsefe", "Tasarım"];

  const filteredData = archives.filter(
    (item) =>
      (categoryFilter === "Tümü" || item.category === categoryFilter) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Arşivde ara..."
            className="p-2 border border-gray-300 rounded-md w-full md:w-1/3"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md mt-2 md:mt-0"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Link key={item._id} href={`/arsiv/${item._id}`} className="block">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {item.date} - {item.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArsivPage;
