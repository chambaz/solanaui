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

const getHealthLabel = (value: number) => {
  if (value >= 66) return "Healthy";
  if (value >= 33) return "At Risk";
  return "Critical";
};

const HealthBar = ({
  value,
  label = "Health Factor",
  showValue = true,
  className,
}: HealthBarProps) => {
  // Clamp between 0-100
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {showValue && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn("text-sm font-medium", getHealthColor(clamped))}
            >
              {getHealthLabel(clamped)}
            </span>
            <span className="text-sm text-muted-foreground">
              {clamped.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-yellow-500 to-emerald-500" />
        {/* Mask overlay to show only filled portion */}
        <div
          className="absolute top-0 right-0 bottom-0 bg-muted rounded-r-full"
          style={{ width: `${100 - clamped}%` }}
        />
        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white border-2 border-foreground/80 shadow-sm transition-all duration-300"
          style={{
            left: `clamp(0px, calc(${clamped}% - 7px), calc(100% - 14px))`,
          }}
        />
      </div>
    </div>
  );
};

export type { HealthBarProps };
export { HealthBar };
