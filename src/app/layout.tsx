import { Analytics } from "@vercel/analytics/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SolanaUI",
    default: "SolanaUI",
  },
  description:
    "Beautifully designed UI components and AI Agent tooling for Solana builders",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          {children}
          <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://x.com/chambaz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              @chambaz
            </a>
          </footer>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
