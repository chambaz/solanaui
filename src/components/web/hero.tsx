import Link from "next/link";

import { IconBrandGithub } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <>
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
    </>
  );
};

export { Hero };
