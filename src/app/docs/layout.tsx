import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

import { TxnToaster } from "@/components/sol/txn-toast";

import { Providers } from "@/components/web/providers";
import { Header } from "@/components/web/header";
import { Footer } from "@/components/web/footer";
import { AppSidebar } from "@/components/web/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
  title: "Docs - SolanaUI",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, roboto_mono.variable, `theme-blue`)}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex min-h-screen w-full flex-col">
                <Header showSidebarTrigger={true} />
                <div className="px-4 pb-16 md:px-6">{children}</div>
                <Footer />
              </main>
            </SidebarProvider>
          </div>
          <TxnToaster />
        </Providers>
      </body>
    </html>
  );
}
