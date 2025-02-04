import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const MagazineList = () => {
  const [magazines, setMagazines] = useState([]);

  useEffect(() => {
    axios.get("/api/magazines").then((response) => {
      console.log("✅ Magazines Data:", response.data);
      setMagazines(response.data);
    });
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Arşivimiz
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {magazines.map((magazine, index) => (
          <a
            key={index}
            href={magazine.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={magazine.thumbnail}
                  alt={magazine.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:opacity-90"
                  onError={(e) => {
                    console.error(`❌ Broken Image: ${magazine.thumbnail}`);
                    e.target.src = "/default-thumbnail.jpeg";
                  }}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {magazine.name}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MagazineList;
