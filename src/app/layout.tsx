import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/footer";
import Navigation from "@/components/shared/navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning with ACM",
  description: "ACM learning platform built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen min-w-[300px] antialiased`}
      >
        <div className="flex-1 flex flex-col min-h-screen">
          <Navigation />
          <main className="flex flex-col flex-1">
            {children}
            <Toaster richColors/>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
