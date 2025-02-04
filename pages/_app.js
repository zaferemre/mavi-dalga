import "../styles/globals.css"; // ✅ Import global styles
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";

// Import Geist Sans and Geist Mono fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Head>
        <title>Mavi Dalga Dergi</title>
        <link rel="icon" href="/mavidalgalogo.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
