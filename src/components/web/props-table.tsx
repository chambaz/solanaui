"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import Dark from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import Light from "react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light";
import { useTheme } from "next-themes";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("ts", ts);

type PropsTableProps = {
  data: {
    name: string;
    type: string;
    default?: string;
  }[];
};

const PropsTable = ({ data }: PropsTableProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const hasDefaults = data.some((item) => item.default);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="rounded-tl-md">Name</TableHead>
          <TableHead>Type</TableHead>
          {hasDefaults && (
            <TableHead className="rounded-tr-md">Default</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={index}
            className="border-border even:bg-muted/20 hover:bg-transparent even:hover:bg-muted/20"
          >
            <TableCell
              className={cn(index === data.length - 1 && "rounded-bl-md")}
            >
              {item.name}
            </TableCell>
            <TableCell>
              <SyntaxHighlighter
                language="ts"
                style={resolvedTheme === "dark" ? Dark : Light}
                customStyle={{
                  backgroundColor: "transparent",
                  margin: 0,
                  transform: "translateX(-10px)",
                }}
                wrapLines
              >
                {item.type}
              </SyntaxHighlighter>
            </TableCell>
            {hasDefaults && (
              <TableCell
                className={cn(index === data.length - 1 && "rounded-br-md")}
              >
                {item.default && (
                  <SyntaxHighlighter
                    language="jsx"
                    style={resolvedTheme === "dark" ? Dark : Light}
                    customStyle={{
                      backgroundColor: "transparent",
                      margin: 0,
                      transform: "translateX(-10px)",
                    }}
                    wrapLines
                  >
                    {item.default}
                  </SyntaxHighlighter>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { PropsTable };
