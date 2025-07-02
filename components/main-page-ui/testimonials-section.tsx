import { GradientSectionHeading, SectionHeading, Subtitle } from "@/components/ui/typography"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants"
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources"

export const TestimonialsSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic}`}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <GradientSectionHeading 
        text={CONENT_RESOURCES.testimonials.title}
      />
      <Subtitle className="leading-relaxed">
        {CONENT_RESOURCES.testimonials.subtitle}
      </Subtitle>
    </div>
    
    <div className={`${LAYOUT.grid} ${SPACING.gap}`}>
      {CONENT_RESOURCES.testimonials.testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </div>
  </section>
) 