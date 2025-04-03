import Link from "next/link";

import { IconBrandGithub, IconRocket } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full flex-col items-center justify-center gap-8 px-6 pb-8 pt-16 text-center lg:px-0">
      <h1 className="text-5xl font-bold md:text-7xl xl:text-8xl">
        Build{" "}
        <span className="from-solana-green to-solana-purple bg-gradient-to-r bg-clip-text text-transparent">
          Solana
        </span>{" "}
        apps faster.
      </h1>
      <h2 className="space-y-1 font-mono text-muted-foreground md:text-lg xl:text-2xl xl:leading-relaxed">
        Beautifully designed UI components, built for Solana.
        <br className="hidden sm:block" /> Extending the{" "}
        <Link
          href="https://ui.shadcn.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-dashed border-muted-foreground/80 transition-colors hover:border-transparent"
        >
          @shadcn/ui library
        </Link>
      </h2>
      <div className="flex items-center gap-2 text-muted-foreground">
        <p>
          Built by{" "}
          <Link
            href="https://twitter.com/chambaz"
            target="_blank"
            rel="noopener noreferrer"
          >
            @chambaz
          </Link>
        </p>
        <Link
          href="https://app.marginfi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5"
        >
          <svg
            width="20"
            viewBox="0 0 36 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_771)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.5905 0.0778083C18.8763 0.0527821 19.1637 0.0276133 19.4525 0L19.4315 16.0206H19.0029C18.4639 16.0814 17.9457 16.2608 17.4866 16.5454C15.0277 18.3726 14.154 21.0608 13.2519 23.8361L13.2304 23.9023C12.4568 26.4271 10.8761 28.639 8.72314 30.2095C6.75457 31.5372 4.60633 31.7237 2.35053 31.9196C2.05391 31.9454 1.75544 31.9713 1.45526 32H0.252502V16.0103H0.880051C1.7692 15.9878 2.63865 15.7484 3.41067 15.3138C4.18268 14.8792 4.83315 14.263 5.30355 13.5202C6.3559 11.8358 7.15213 10.009 7.66692 8.09773C8.44113 5.57327 10.0263 3.3638 12.1846 1.80064C14.1537 0.466372 16.3207 0.27659 18.5905 0.0778083ZM19.4525 15.8118H35.6407V32H19.4525V15.8118Z"
                fill="hsl(var(--foreground))"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_1_771">
                <rect width="36" height="32" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          marginfi
        </Link>
      </div>
      <div className="mt-6 flex items-center gap-4 xl:gap-8">
        <Link href="/docs">
          <Button className="xl:h-auto xl:gap-2 xl:px-6 xl:text-lg">
            <IconRocket size={18} /> Get Started
          </Button>
        </Link>
        <Link
          href="https://github.com/chambaz/solanaui"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="secondary"
            className="xl:h-auto xl:gap-2 xl:px-6 xl:text-lg"
          >
            <IconBrandGithub size={18} /> GitHub
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { Hero };
