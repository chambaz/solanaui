import { TokenInput } from "@/components/sol/token-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ActionBoxDetail {
  label: string;
  value: string;
  className?: string;
}

interface ActionBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  label?: string;
  details?: ActionBoxDetail[];
  submitLabel?: string;
  className?: string;
}

const ActionBox = ({
  tokens,
  defaultToken,
  balance,
  label,
  details,
  submitLabel = "Submit",
  className,
}: ActionBoxProps) => {
  return (
    <div className={cn("flex flex-col gap-4 border rounded-lg p-4", className)}>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
      <TokenInput
        tokens={tokens}
        defaultToken={defaultToken}
        balance={balance}
      />
      {details && details.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-1.5 text-sm">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className={detail.className}>{detail.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <Button className="w-full" size="lg">
        {submitLabel}
      </Button>
    </div>
  );
};

export type { ActionBoxProps, ActionBoxDetail };
export { ActionBox };
