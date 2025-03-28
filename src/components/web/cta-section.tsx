"use client";

import { motion } from "motion/react";
import { IconBrandGithub, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <div className="w-full py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <motion.h2
          className="mb-6 text-4xl font-bold xl:text-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5 }}
        >
          Ready to build your Solana app?
        </motion.h2>
        <motion.p
          className="mb-12 text-muted-foreground xl:text-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Start building today with SolanaUI&apos;s components and utilities.
        </motion.p>
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/docs">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started <IconArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
          <Link
            href="https://github.com/username/solanaui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <IconBrandGithub className="mr-2" size={18} /> GitHub
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export { CtaSection };
