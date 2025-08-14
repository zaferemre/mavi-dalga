"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          {/* Animated radial accent */}
          <motion.svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            initial={{ rotate: 0, opacity: 0.6 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#orange-gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="orange-gradient">
                <stop stopColor="#FFA500" />
                <stop offset={1} stopColor="#FF4500" />
              </radialGradient>
            </defs>
          </motion.svg>

          {/* Text */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Mavi Dalga’ya Katıl!
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-gray-300">
              Mavi Dalga, öğrenciler tarafından gönüllülükle sürdürülen bağımsız
              bir yayındır. İçerik üretmekten tasarıma, dağıtımdan organizasyona
              kadar her adımda katkınız bizim için çok değerli. Sen de bu
              heyecana ortak ol, derginin bir parçası haline gel!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/katkiyap"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Katkı yapın
                </Link>
              </motion.div>
              <Link
                href="/hakkimizda"
                className="text-sm font-semibold leading-6 text-white"
              >
                Hakkımızda <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Image */}
          <motion.div
            className="relative mt-16 h-80 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:h-full lg:w-auto lg:flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              alt="Mavi Dalga illüstrasyonu"
              src="/orangeLady.jpg"
              width={1824}
              height={1080}
              className="h-full w-full rounded-md bg-white/5 object-cover object-center ring-1 ring-white/10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
