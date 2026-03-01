import type { Metadata, Viewport } from "next";
import { Albert_Sans, Rethink_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "sonner";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ImiJewel – Imitation Jewellery",
  description:
    "Explore our stunning collection of imitation jewellery. Necklaces, earrings, bangles, rings & more. Quality jewellery at affordable prices.",
  keywords: "imitation jewellery, fashion jewellery, artificial jewellery, ImiJewel",
  openGraph: {
    title: "ImiJewel – Imitation Jewellery",
    description: "Explore our stunning collection of imitation jewellery.",
    type: "website",
  },
};

import { Navbar } from "@/components/home/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${albertSans.variable} ${rethinkSans.variable} antialiased font-albert`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
