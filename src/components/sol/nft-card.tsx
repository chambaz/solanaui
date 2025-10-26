"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const NFTCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NFTCard</CardTitle>
        <CardDescription>NFTCard description</CardDescription>
      </CardHeader>
      <CardContent>
        <div>NFTCard content</div>
      </CardContent>
      <CardFooter>
        <Button>NFTCard footer</Button>
      </CardFooter>
    </Card>
  );
};

export { NFTCard };
