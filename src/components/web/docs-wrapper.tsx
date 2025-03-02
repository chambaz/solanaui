"use client";

import { cn } from "@/lib/utils";

import { useSidebar } from "@/components/ui/sidebar";

const DocsWrapper = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        "prose w-full max-w-5xl space-y-8 pt-8 dark:prose-invert [&_a]:border-b [&_a]:border-foreground/75 [&_a]:no-underline [&_h1]:mb-0 [&_h1]:text-3xl [&_h1]:font-medium",
        !open && "mx-auto",
      )}
    >
      {children}
    </div>
  );
};

export { DocsWrapper };
