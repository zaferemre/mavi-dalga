import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen text-black relative">
      <Header />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
      <Footer />
    </div>
  );
}
