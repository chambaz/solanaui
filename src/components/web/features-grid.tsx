"use client";

import {
  IconComponents,
  IconCopy,
  IconCurrencySolana,
  IconDatabase,
  IconPalette,
  IconWallet,
} from "@tabler/icons-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
};

const FeatureCard = ({
  title,
  description,
  icon,
  className,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all hover:shadow-md",
          className,
        )}
      >
        <CardHeader className="pb-2">
          <div className="mb-2 w-fit rounded-md bg-primary/10 p-2">{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesGrid = () => {
  const features = [
    {
      title: "Solana Components",
      description:
        "UI components built for Solana apps. Wallet connect dialogs, token comboboxes, price charts, and more.",
      icon: <IconCurrencySolana size={24} />,
      className: "md:col-span-2",
    },
    {
      title: "Asset Fetching",
      description:
        "Built-in utilities for fetching assets and prices, including Birdeye, Helius, and Umi.",
      icon: <IconDatabase size={24} />,
      className: "md:col-span-2",
    },
    {
      title: "Shadcn Integration",
      description:
        "Built on top of shadcn's powerful UI library, providing a consistent design system that's easy to customize.",
      icon: <IconComponents size={24} />,
    },
    {
      title: "Copy & Paste",
      description:
        "No dependencies and complex customizations. Copy and paste components directly into your project.",
      icon: <IconCopy size={24} />,
    },
    {
      title: "Customizable",
      description:
        "Easily customize components to match your brand with Tailwind CSS utility classes.",
      icon: <IconPalette size={24} />,
    },
    {
      title: "Scalable",
      description:
        "Prototype to production. Start with built-in utilities and swap in your own data sources and pipelines.",
      icon: <IconWallet size={24} />,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24">
      <motion.h2
        className="mb-16 text-center text-3xl font-bold xl:text-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
      >
        Everything you need to build Solana frontends
      </motion.h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            className={feature.className}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
};

export { FeaturesGrid };
