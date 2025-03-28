import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import { TxnToaster } from "@/components/sol/txn-toast";

import { Providers } from "@/components/web/providers";
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
  title: "SolanaUI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, roboto_mono.variable, ``)}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <main className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </main>
          <TxnToaster />
        </Providers>
      </body>
    </html>
  );
}
