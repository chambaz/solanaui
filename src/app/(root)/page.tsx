"use client";

import Link from "next/link";

import { IconBrandGithub } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center gap-8 py-16 text-center">
        <h1 className="text-7xl font-bold">
          Build{" "}
          <span className="bg-gradient-to-r from-teal-200 to-violet-500 bg-clip-text text-transparent">
            Solana
          </span>{" "}
          apps faster.
        </h1>
        <div className="space-y-1 font-mono text-lg text-muted-foreground">
          <h2>Beautifully designed UI components, built for Solana.</h2>
          <h3>
            Extending{" "}
            <Link
              href="http://twitter.com/shadcn"
              className="border-b border-dashed border-muted-foreground/30 transition-colors hover:border-transparent"
            >
              @shadcn&apos;s
            </Link>{" "}
            <Link
              href=""
              className="border-b border-dashed border-muted-foreground/30 transition-colors hover:border-transparent"
            >
              powerful ui library
            </Link>
            .
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <Button>Get Started</Button>
          <Button variant="secondary">
            <IconBrandGithub size={18} /> GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
