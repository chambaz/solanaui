"use client";

import { Hero } from "@/components/web/hero";
import { FeaturesGrid } from "@/components/web/features-grid";
import { CodeShowcase } from "@/components/web/code-showcase";
import { CtaSection } from "@/components/web/cta-section";
import { DemoWrapper } from "@/components/web/demo-wrapper";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col items-center">
      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      {/* Features Grid */}
      <section className="w-full bg-muted/25">
        <FeaturesGrid />
      </section>

      {/* Code Showcase */}
      <section>
        <CodeShowcase />
      </section>

      {/* Demo Links */}
      <section className="w-full bg-muted/25 py-16">
        <h2 className="text-center text-3xl font-bold xl:text-4xl">
          See SolanaUI in action
        </h2>
        <DemoWrapper />
      </section>

      {/* CTA Section */}
      <section>
        <CtaSection />
      </section>
    </div>
  );
}
