import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeGraspers Marketplace",
  description: "Full-stack Spring Boot & Next.js Marketplace",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
      <AppProvider>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </AppProvider>
      </body>
      </html>
  );
}