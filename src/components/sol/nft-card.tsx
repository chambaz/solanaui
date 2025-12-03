"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NFTCard = () => {
  return (
    <Card className="max-w-md w-full py-0 gap-0">
      <CardContent className="p-0">
        <Image
          src="https://madlads.s3.us-west-2.amazonaws.com/images/7104.png"
          alt="Mad Lad #7104"
          width={400}
          height={400}
          className="w-full aspect-square object-cover m-0 rounded-t-xl"
        />
      </CardContent>
      <CardHeader className="bg-muted rounded-b-xl py-4 border-t">
        <CardDescription className="text-muted-foreground">
          Mad Lads
        </CardDescription>
        <CardTitle className="text-xl font-medium">Mad Lad #7104</CardTitle>
      </CardHeader>
    </Card>
  );
};

export { NFTCard };
