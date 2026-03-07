import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";

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
