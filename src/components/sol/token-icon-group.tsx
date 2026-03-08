import { TokenIcon } from "@/components/sol/token-icon";
import { cn } from "@/lib/utils";

interface TokenIconGroupProps {
  tokens: { src: string; alt?: string }[];
  size?: number;
  overlap?: number;
  max?: number;
  className?: string;
}

const TokenIconGroup = ({
  tokens,
  size = 24,
  overlap = -8,
  max = 4,
  className,
}: TokenIconGroupProps) => {
  const visible = tokens.slice(0, max);
  const remaining = tokens.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((token, i) => (
        <div
          key={`${token.src}-${i}`}
          className="rounded-full ring-2 ring-background"
          style={{ marginLeft: i === 0 ? 0 : overlap }}
        >
          <TokenIcon
            src={token.src}
            alt={token.alt ?? "Token"}
            width={size}
            height={size}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="flex items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background font-medium"
          style={{
            width: size,
            height: size,
            marginLeft: overlap,
            fontSize: size * 0.35,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export type { TokenIconGroupProps };
export { TokenIconGroup };
