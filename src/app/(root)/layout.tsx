import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import { Header } from "@/components/web/header";
import { Footer } from "@/components/web/footer";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "solanaui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, roboto_mono.variable)}>
      <body>
        <Header />
        <main className="container mx-auto flex min-h-[calc(100vh-144px)] gap-8 p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
