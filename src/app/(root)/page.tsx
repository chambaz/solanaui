import { Hero } from "@/components/web/hero";
import { DemoLinks } from "@/components/web/demo-links";
import { Sponsored } from "@/components/web/sponsored";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-135px)] w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center gap-8 pb-8 pt-16 text-center">
        <Hero />
        <DemoLinks />
        <Sponsored />
      </div>
    </div>
  );
}
