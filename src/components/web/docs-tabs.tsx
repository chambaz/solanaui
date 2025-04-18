"use client";

import React from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import Dark from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import Light from "react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type DocsVariant = {
  value: string;
  label?: string;
  preview?: React.ReactNode;
  code?: string;
};

type DocsTabsProps = {
  variants: DocsVariant[];
};

SyntaxHighlighter.registerLanguage("tsx", tsx);

const DocsTabs = ({ variants }: DocsTabsProps) => {
  const { resolvedTheme } = useTheme();
  const [activeVariantIndex, setActiveVariantIndex] = React.useState<number>(0);
  const [activeVariant, setActiveVariant] = React.useState<DocsVariant>(
    variants[activeVariantIndex],
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setActiveVariant(variants[activeVariantIndex]);
  }, [variants, activeVariantIndex]);

  return (
    <div className="not-prose space-y-6">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="relative rounded-lg border border-border bg-background">
            <div className="px-6 py-4">
              {variants.length > 1 && (
                <div className="flex items-center gap-2">
                  <Label>Variant:</Label>
                  <Select
                    defaultValue={activeVariantIndex.toString()}
                    onValueChange={(value) => {
                      setActiveVariantIndex(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-[190px]">
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {variants.map((variant, index) => (
                          <SelectItem
                            key={index.toString()}
                            value={index.toString()}
                          >
                            {variant.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="relative flex w-full items-center justify-center bg-background pb-32 pt-24">
                {activeVariant.preview && activeVariant.preview}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div>
            {activeVariant.code && mounted ? (
              <SyntaxHighlighter
                language="tsx"
                style={resolvedTheme === "dark" ? Dark : Light}
                wrapLines
              >
                {activeVariant.code}
              </SyntaxHighlighter>
            ) : (
              <Skeleton className="mb-2 h-[49px] w-full rounded-md" />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { DocsTabs };
export type { DocsVariant };
