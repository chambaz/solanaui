"use client";

import Link from "next/link";
import Image from "next/image";

import { IconBrandGithub } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center gap-8 py-16 text-center">
        <h1 className="text-5xl font-bold md:text-7xl">
          Build{" "}
          <span className="bg-gradient-to-r from-teal-200 to-violet-500 bg-clip-text text-transparent">
            Solana
          </span>{" "}
          apps faster.
        </h1>
        <div className="space-y-1 font-mono text-muted-foreground md:text-lg">
          <h2>
            Beautifully designed UI components, built for Solana.
            <br className="hidden sm:block" /> Extending{" "}
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
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button>Get Started</Button>
          <Button variant="secondary">
            <IconBrandGithub size={18} /> GitHub
          </Button>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-5xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-16">
          <Link href="/demo">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dashboard Demo</CardTitle>
                <CardDescription>
                  SolanaUI components in a web app dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/img/demo-dashboard.png"
                  alt="Dashboard Demo"
                  width={764}
                  height={425}
                />
              </CardContent>
            </Card>
          </Link>
          <Link href="/demo?view=swap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Swap Demo</CardTitle>
                <CardDescription>
                  SolanaUI components in a swap app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/img/demo-swap.png"
                  alt="Swap Demo"
                  width={764}
                  height={425}
                />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
