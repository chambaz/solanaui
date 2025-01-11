import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DemoLinks = () => {
  return (
    <div className="mx-auto mt-12 grid w-full max-w-5xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-16">
      <Link href="/demo">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard Demo</CardTitle>
            <CardDescription>
              SolanaUI components in a web app dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src="/img/demo-dashboard.png"
              alt="Dashboard Demo"
              width={764}
              height={425}
            />
          </CardContent>
        </Card>
      </Link>
      <Link href="/demo?view=swap">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Swap Demo</CardTitle>
            <CardDescription>
              SolanaUI components in a swap app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src="/img/demo-swap.png"
              alt="Swap Demo"
              width={764}
              height={425}
            />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export { DemoLinks };
