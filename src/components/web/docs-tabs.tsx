"use client";

import React from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import ColdDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import ColdLight from "react-syntax-highlighter/dist/esm/styles/prism/coldark-cold";
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
  const { theme } = useTheme();
  const [activeVariantIndex, setActiveVariantIndex] = React.useState<number>(0);
  const [activeVariant, setActiveVariant] = React.useState<DocsVariant>(
    variants[activeVariantIndex],
  );

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
          <div className="rounded-lg bg-background text-sm">
            {activeVariant.code && (
              <SyntaxHighlighter
                language="tsx"
                style={theme === "dark" ? ColdDark : ColdLight}
                wrapLines
              >
                {activeVariant.code}
              </SyntaxHighlighter>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { DocsTabs };
export type { DocsVariant };
