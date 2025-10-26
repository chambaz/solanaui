import { TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const TrendBadge = () => {
  return (
    <Badge className="bg-green-900/50 text-green-300/75 border-green-900">
      <TrendingUpIcon className="size-4" /> Trend
    </Badge>
  );
};

export { TrendBadge };
