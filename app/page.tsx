import { HeroSection } from "@/components/main-page-ui/hero-section"
import { WhyItWorksSection } from "@/components/main-page-ui/why-it-works-section"
import { TestimonialsSection } from "@/components/main-page-ui/testimonials-section"
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants"
import { LeadRequestFormFeature } from "@/features/lead/lead-request/lead-request-form.feature"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className={`${LAYOUT.container} my-16 md:my-20 lg:my-24 px-4 md:px-6 max-w-6xl flex flex-col items-center justify-center text-center ${SPACING.gapSection}`}>
        <div className="h-[50vh] flex items-center justify-center w-full">
        <HeroSection />

        </div>
        <WhyItWorksSection />
        <TestimonialsSection />
        <LeadRequestFormFeature />
      </div>
    </main>
  )
}
