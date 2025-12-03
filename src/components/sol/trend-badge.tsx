import { TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TrendBadgeProps = {
  children?: React.ReactNode;
};

const TrendBadge = ({ children }: TrendBadgeProps) => {
  return (
    <Badge className="bg-green-900/50 text-green-300/75 border-green-900">
      <TrendingUpIcon className="size-4" />
      {children && <span className="text-xs">{children}</span>}
    </Badge>
  );
};

export { TrendBadge };
