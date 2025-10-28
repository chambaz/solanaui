import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { ComponentCode } from "@/components/docs/component-code";
import { ComponentDemo } from "@/components/docs/component-demo";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...TabsComponents,
    ComponentCode,
    ComponentDemo,
  };
}
