import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import { Header } from "@/components/web/header";
import { Footer } from "@/components/web/footer";
import { Sidebar } from "@/components/web/sidebar";

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

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, roboto_mono.variable)}>
      <body>
        <Header />
        <div className="container flex min-h-screen gap-8 p-8">
          <Sidebar />
          <main className="w-full text-sm text-muted-foreground">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
