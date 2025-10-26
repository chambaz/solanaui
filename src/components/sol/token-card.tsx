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

const TokenCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TokenCard</CardTitle>
        <CardDescription>TokenCard description</CardDescription>
      </CardHeader>
      <CardContent>
        <div>TokenCard content</div>
      </CardContent>
      <CardFooter>
        <Button>TokenCard footer</Button>
      </CardFooter>
    </Card>
  );
};

export { TokenCard };
