import React, { useState, useEffect } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll events to update the header style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["HAKKIMIZDA", "ARSIV", "KATKI YAP", "MDBLOG", "İLETİŞİM"];
  const mobileMainMenuItems = ["HAKKIMIZDA", "ARSIV", "MDBLOG"];
  const mobileDropdownItems = menuItems.filter(
    (item) => !mobileMainMenuItems.includes(item)
  );

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white text-black shadow-md" : "bg-transparent text-white"
      }`}
    >
      {/* Navbar */}
      <nav className="font-chronica relative flex flex-col items-center justify-between w-full mx-auto">
        <div className="w-full flex items-center justify-between py-4 px-6">
          {/* Logo - MAVİ DALGA */}
          <a
            href="/"
            className={`text-5xl font-bold tracking-widest leading-none ${
              scrolled ? "text-black" : "text-white"
            }`}
            style={{ letterSpacing: "8px" }}
          >
            <div>mavi</div>
            <div>dalga</div>
          </a>

          {/* Right Menu */}
          <div className="ml-auto flex items-center space-x-4">
            {/* Social Media Links */}
            <a
              href="https://twitter.com/mavidalgadergi"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition duration-150 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              <i className="fa fa-twitter text-2xl"></i>
            </a>
            <a
              href="https://www.instagram.com/mavidalgadergi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition duration-150 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              <i className="fa fa-instagram text-2xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/mavidalga/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition duration-150 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              <i className="fa fa-linkedin text-2xl"></i>
            </a>

            {/* Hamburger Menu (Hidden on Desktop) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`ml-4 transition duration-150 ease-in-out md:hidden ${
                scrolled ? "text-black hover:text-gray-700" : "text-white"
              }`}
            >
              <svg
                fill="currentColor"
                focusable="false"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M2 4h20a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 7h20a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 7h20a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links (Desktop: All Items, Mobile: Subset) */}
        <div className="w-full border-t border-gray-200">
          <ul className="hidden md:flex items-center justify-center flex-nowrap px-2 sm:px-0">
            {menuItems.map((item) => (
              <li key={item} className="mr-4">
                <a
                  href={`/${item.toLowerCase()}`}
                  className={`block py-2 text-sm font-semibold tracking-widest transition duration-150 ease-in-out ${
                    scrolled ? "text-black hover:text-gray-700" : "text-white"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Main Menu */}
          <ul className="flex md:hidden items-center justify-center flex-nowrap px-2 sm:px-0">
            {mobileMainMenuItems.map((item) => (
              <li key={item} className="mr-4">
                <a
                  href={`/${item.toLowerCase()}`}
                  className={`block py-2 text-sm font-semibold tracking-widest transition duration-150 ease-in-out ${
                    scrolled ? "text-black hover:text-gray-700" : "text-white"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Dropdown Menu (Only on Mobile) */}
        {mobileMenuOpen && (
          <div className="absolute top-full w-full bg-white shadow-md text-black md:hidden">
            <ul className="flex flex-col items-start px-6 py-4 space-y-2">
              {mobileDropdownItems.map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block py-2 text-sm font-semibold hover:text-gray-700 transition duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
