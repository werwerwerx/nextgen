import { HeroSection } from "@/components/main-page-ui/hero-section";
import { WhyItWorksSection } from "@/components/main-page-ui/why-it-works-section";
import { StatsSection } from "@/components/main-page-ui/stats-section";
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div
        className={`${LAYOUT.container} my-16 sm:my-10 md:my-16 lg:my-20 px-4 md:px-2  flex flex-col items-center justify-center text-center ${SPACING.gapSection}`}
      >
        <div className="h-[66vh] w-full">
          <HeroSection />
        </div>

        <StatsSection />
        <WhyItWorksSection />
        {/* <TestimonialsSection /> */}
        {/* <LeadRequestFormFeature /> */}
      </div>
    </main>
  );
}
