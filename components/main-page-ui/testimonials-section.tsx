import { GradientSectionHeading, SectionHeading, Subtitle } from "@/components/ui/typography"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants"
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources"

export const TestimonialsSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic}`}>
    <div className={`flex flex-col ${SPACING.gap} `}>
      <GradientSectionHeading 
        text={CONENT_RESOURCES.testimonials.title}
      />
      <Subtitle className="leading-relaxed">
        {CONENT_RESOURCES.testimonials.subtitle}
      </Subtitle>
    </div>
    
    <div className={`flex flex-col ${SPACING.gap} md:grid md:grid-cols-2 gap-3 md:gap-4`}>
    {/* Left column - first two stats stacked */}
    <div className="flex">
      <TestimonialCard testimonial={CONENT_RESOURCES.testimonials.testimonials[0]} className="items-center justify-center h-full flex" />
    </div>
    <div className="flex flex-col gap-3 md:gap-4">
      <TestimonialCard testimonial={CONENT_RESOURCES.testimonials.testimonials[2]} />
      <TestimonialCard testimonial={CONENT_RESOURCES.testimonials.testimonials[1]} />
    </div>
    
    {/* Right column - large third stat */}
    </div>
  </section>
) 