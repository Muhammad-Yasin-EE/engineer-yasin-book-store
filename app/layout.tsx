import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "@/lib/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloatingBar from "@/components/SocialFloatingBar";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Engineer Yasin | Academic, Jobs & Software Portal",
  description: "Download engineering software, apply for scholarships and jobs, order web coding services, or enroll in academic courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body className="min-h-full flex flex-col bg-white text-[#222222] selection:bg-[#B8212E]/10 selection:text-[#B8212E] antialiased overflow-x-hidden">
        <CartProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <SocialFloatingBar />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
