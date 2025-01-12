"use client";

import { cn } from "@/lib/utils";

import { useSidebar } from "@/components/ui/sidebar";

const DocsWrapper = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar();
  return (
    <div className={cn("w-full max-w-5xl space-y-8 pt-8", !open && "mx-auto")}>
      {children}
    </div>
  );
};

export { DocsWrapper };
