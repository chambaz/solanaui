import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

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
      </body>
    </html>
  );
}
