"use client";

import {
  UsersIcon,
  LightBulbIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    name: "Öğrenci İnisiyatifi",
    description:
      "Mavi Dalga, tamamen Marmara Üniversitesi Tıp Fakültesi öğrencileri tarafından hazırlanır. Her sayı, gönüllülükle ve özveriyle oluşturulur.",
    icon: UsersIcon,
  },
  {
    name: "Yaratıcı Ruh",
    description:
      "Bilimsel yazılardan karikatürlere, edebiyattan röportajlara kadar geniş bir yelpazede içerik sunar. Herkesin katkı sağlayabileceği bir platformdur.",
    icon: LightBulbIcon,
  },
  {
    name: "Bağımsız Yayıncılık",
    description:
      "Hiçbir ticari veya kurumsal bağlılık olmadan, özgünlüğünü ve ifade özgürlüğünü temel alarak yayımlanır.",
    icon: NewspaperIcon,
  },
] as const;

export default function FeatureSec() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2
                className="text-base font-semibold leading-7"
                style={{ color: "#fe5200" }}
              >
                Biz Kimiz?
              </h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Mavi Dalga’yı Tanıyın
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Mavi Dalga, Marmara Üniversitesi Tıp Fakültesi öğrencileri
                tarafından kar amacı güdülmeden çıkarılan bir öğrenci
                dergisidir.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.name}
                    className="relative pl-9"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 size-5"
                        style={{ color: "#fe5200" }}
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              alt="Mavi Dalga ekibi"
              src="/dalgaMain.jpg"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl ring-1 ring-gray-400/10 shadow-xl sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
