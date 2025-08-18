import type { Metadata } from "next";
import "./globals.css";
import "../public/dist/css/tabler.min.css"
import "../public/dist/css/tabler-vendors.min.css"
import Providers from "./Providers";
import Navbar from "./components/Navbar";
import Head from "next/head";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BERM",
  description: "Blockchain-Enhanced Rehabilitation Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="./favicon.png" />
      </Head>
      <body>
        <Script src="./dist/js/demo-theme.min.js" defer />
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Script src="./dist/js/tabler.min.js" defer />
      </body>
    </html>
  );
}
