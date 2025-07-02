import { GradientSectionHeading, Subtitle } from "@/components/ui/typography"
import { FeatureCard } from "@/components/ui/feature-card"
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants"
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources"

export const WhyItWorksSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic}`}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <GradientSectionHeading 
        text={CONENT_RESOURCES.why_it_works.title}
      />
      <Subtitle className="leading-relaxed">
        {CONENT_RESOURCES.why_it_works.subtitle}
      </Subtitle>
    </div>
    
    <div className={`${LAYOUT.grid} ${SPACING.gapCards}`}>
      {CONENT_RESOURCES.why_it_works.features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </section>
) 