import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        {
          type: "main",
          text: "Docs",
          url: "/docs",
        },
        {
          type: "main",
          text: "Components",
          url: "/docs/components",
        },
        {
          type: "main",
          text: "Examples",
          url: "/docs/examples",
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
