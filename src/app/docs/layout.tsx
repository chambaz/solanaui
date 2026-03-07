import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Toaster } from "@/components/ui/sonner";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions()}>
      {children}
      <Toaster />
    </DocsLayout>
  );
}
