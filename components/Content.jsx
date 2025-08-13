"use client";

import {
  DocumentArrowDownIcon,
  FolderOpenIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Content() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        {/* Title */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p
                className="text-base font-semibold leading-7"
                style={{ color: "#fe5200" }}
              >
                Arşiv Yenilendi
              </p>
              <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                MD Arşiv
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                Marmara Tıp Fakültesi’nin geçmiş yıllarına dair bir yolculuğa
                çıkmaya hazır mısın? Mavi Dalga’nın tüm sayılarını bir araya
                getirdik. 2020 Kasım sayısından çok daha önceye gitmek istersen,
                seni MD Arşiv’e bekliyoruz!
              </p>
            </div>
          </div>
        </div>

        {/* Sticky image */}
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              alt="MD Arşiv kapakları"
              src="/arsivImg.png"
              width={912}
              height={512}
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 ring-1 ring-gray-400/10 shadow-xl sm:w-[57rem]"
            />
          </motion.div>
        </div>

        {/* Body list */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
              <p>
                Yıllardır sakladığımız bu arşiv, şimdi dijitalde seninle. Mavi
                Dalga&apos;nın geçmiş sayılarında kaybolmak, nostaljik bir
                yolculuğa çıkmak için hazır mısın?
              </p>

              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                {[
                  {
                    icon: FolderOpenIcon,
                    title: "Kolay Erişim",
                    desc: "Tüm sayılar düzenli klasör yapısıyla senin için sıralandı. Dilediğin sayıya tek tıkla ulaş!",
                  },
                  {
                    icon: DocumentArrowDownIcon,
                    title: "PDF Olarak İndir",
                    desc: "Sayıları çevrimdışı okumak mı istiyorsun? İndir, sakla ve istediğin zaman geri dön.",
                  },
                  {
                    icon: ClockIcon,
                    title: "Zamana Yolculuk",
                    desc: "Mavi Dalga’nın ilk sayılarına göz at, fakültemizin tarihine bir pencere aç!",
                  },
                ].map((item, idx) => (
                  <motion.li
                    key={item.title}
                    className="flex gap-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                  >
                    <item.icon
                      aria-hidden="true"
                      className="mt-1 size-5 flex-none"
                      style={{ color: "#fe5200" }}
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        {item.title}
                      </strong>{" "}
                      {item.desc}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <p className="mt-8">
                Geçmişin izlerini sürmek hiç bu kadar kolay olmamıştı.
                Arşivimizde gezin, tarihle bağ kur, ilham al!
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                Arşiv sadece bir başlangıç!
              </h2>
              <p className="mt-6">
                Yeni sayılarımızı da buradan takip edebilirsin. Her biri
                fakültemizin ruhunu yansıtan içeriklerle dolu. Mavi Dalga’yla
                geçmiş ve gelecek bir arada!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
