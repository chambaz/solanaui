import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DemoLinks = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24">
      <motion.h2
        className="mb-12 text-center text-3xl font-bold xl:text-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
      >
        See SolanaUI in Action
      </motion.h2>
      <div className="mx-auto mt-12 grid w-full max-w-5xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export { DemoLinks };
