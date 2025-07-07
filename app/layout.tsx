'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "../public/dist/css/tabler.min.css";
import "../public/dist/css/tabler-vendors.min.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideNavbarPaths = ["/login", "/register-rehab-center"];
  const showNavbar = !hideNavbarPaths.includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
