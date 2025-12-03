"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

const TokenIcon = ({
  alt = "Token",
  className = "",
  width,
  height,
  ...props
}: React.ComponentProps<typeof Image>) => {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  );

  if (status === "error") {
    const fontSize = typeof width === "number" ? width * 0.35 : "1rem";
    return (
      <div
        className={cn(
          "rounded-full bg-muted inline-flex items-center justify-center font-medium text-muted-foreground",
          className
        )}
        style={{ width, height, fontSize }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative inline-flex" style={{ width, height }}>
      {status === "loading" && (
        <Skeleton
          className={cn("rounded-full absolute inset-0", className)}
          style={{ width, height }}
        />
      )}
      <Image
        alt={alt}
        className={cn(
          "rounded-full",
          status === "loading" && "opacity-0",
          className
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};

export { TokenIcon };
