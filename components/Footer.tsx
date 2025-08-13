import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logologo.png"
                className="me-3"
                alt="Mavi Dalga Logo"
                width={40}
                height={40}
              />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Mavi Dalga
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Bize Yazın
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="mailto:info@mavidalga.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Mail
                  </a>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:underline">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Bizi Takip Edin
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://instagram.com/mavidalgadergi"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/mavidalgadergi"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Bizimle paylaşın
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="/yayin-ilkelerimiz"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Yayın İlkelerimiz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            © 2025 <span className="font-medium">Mavi Dalga Dergi™</span>. All
            Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
