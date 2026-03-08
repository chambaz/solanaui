"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NFTCardProps extends React.ComponentProps<typeof Card> {
  name: string;
  image: string;
  collection?: string;
  price?: string;
  currency?: string;
}

const NFTCard = ({
  name,
  image,
  collection,
  price,
  currency = "SOL",
  className,
  ...props
}: NFTCardProps) => {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <Card
      className={cn("w-full py-0 gap-0 overflow-hidden", className)}
      {...props}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          {status === "loading" && (
            <Skeleton className="absolute inset-0 rounded-none" />
          )}
          {status === "error" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
              Failed to load
            </div>
          ) : (
            <img
              src={image}
              alt={name}
              className={cn(
                "w-full aspect-square object-cover",
                status === "loading" && "opacity-0",
              )}
              onLoad={() => setStatus("loaded")}
              onError={() => setStatus("error")}
            />
          )}
        </div>
      </CardContent>
      <CardHeader className="bg-muted/50 py-3 px-4 border-t">
        {collection && (
          <CardDescription className="text-xs text-muted-foreground">
            {collection}
          </CardDescription>
        )}
        <CardTitle className="text-base font-medium">{name}</CardTitle>
      </CardHeader>
      {price && (
        <CardFooter className="bg-muted/50 px-4 pb-3 pt-0">
          <span className="text-sm font-medium">
            {price} {currency}
          </span>
        </CardFooter>
      )}
    </Card>
  );
};

export type { NFTCardProps };
export { NFTCard };
