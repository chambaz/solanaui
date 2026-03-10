import { cn } from "@/lib/utils";

interface HealthBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const getHealthColor = (value: number) => {
  if (value >= 66) return "text-emerald-500";
  if (value >= 33) return "text-yellow-500";
  return "text-red-400";
};

const HealthBar = ({
  value,
  label = "Health Factor",
  showValue = true,
  className,
}: HealthBarProps) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {showValue && (
          <span className={cn("text-sm font-medium", getHealthColor(clamped))}>
            {clamped.toFixed(0)}%
          </span>
        )}
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        >
          <div
            className="h-full bg-gradient-to-r from-red-400 via-yellow-500 to-emerald-500"
            style={{ width: `${clamped > 0 ? (100 / clamped) * 100 : 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export type { HealthBarProps };
export { HealthBar };
