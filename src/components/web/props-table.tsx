import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={item.name}
            className="border-border even:bg-muted/20 hover:bg-transparent even:hover:bg-muted/20"
          >
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.default && item.default}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { PropsTable };
