import { TokenIcon } from "@/components/sol/token-icon";
import { TrendBadge } from "@/components/sol/trend-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PositionTableProps {
  positions: {
    symbol: string;
    icon: string;
    side: "long" | "short";
    size: string;
    value: string;
    leverage: string;
    entryPrice: string;
    markPrice: string;
    pnl: string;
    pnlPercent?: string;
    pnlTrend?: "up" | "down";
  }[];
  className?: string;
}

const PositionTable = ({ positions, className }: PositionTableProps) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Entry</TableHead>
          <TableHead>Mark</TableHead>
          <TableHead>Leverage</TableHead>
          <TableHead className="text-right">P&L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position, i) => {
          const pnlTrend =
            position.pnlTrend ??
            (position.pnl.trim().startsWith("-") ? "down" : "up");

          return (
            <TableRow key={`${position.symbol}-${position.side}-${i}`}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium uppercase",
                      position.side === "long"
                        ? "text-emerald-500"
                        : "text-red-400",
                    )}
                  >
                    {position.side}
                  </span>
                  <TokenIcon
                    src={position.icon}
                    alt={position.symbol}
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">{position.symbol}</span>
                </div>
              </TableCell>
              <TableCell>{position.size}</TableCell>
              <TableCell>{position.value}</TableCell>
              <TableCell>{position.entryPrice}</TableCell>
              <TableCell>{position.markPrice}</TableCell>
              <TableCell>{position.leverage}</TableCell>
              <TableCell className="text-right">
                <TrendBadge trend={pnlTrend}>
                  {position.pnl}
                  {position.pnlPercent && ` (${position.pnlPercent})`}
                </TrendBadge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export type { PositionTableProps };
export { PositionTable };
