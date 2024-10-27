import React from "react";

import Image from "next/image";

type IconProps = {
  token: string;
  size?: number;
};

const TokenIcon = ({ token, size = 24 }: IconProps) => {
  const imagePath = `${process.env.NEXT_PUBLIC_TOKEN_ICON_URL}/${token}.png`;

  return (
    <div className="rounded-full border border-border bg-background p-0">
      <Image
        src={imagePath}
        alt={token}
        width={size}
        height={size}
        className="rounded-full"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export { TokenIcon };
