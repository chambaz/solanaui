import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import ColdDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="rounded-tl-md">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="rounded-tr-md">Default</TableHead>
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
                style={ColdDark}
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
            <TableCell
              className={cn(index === data.length - 1 && "rounded-br-md")}
            >
              {item.default && (
                <SyntaxHighlighter
                  language="jsx"
                  style={ColdDark}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { PropsTable };
