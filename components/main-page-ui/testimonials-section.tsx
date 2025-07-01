import { SectionHeading } from "@/components/ui/typography"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants"
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources"

export const TestimonialsSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic}`}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <SectionHeading className="leading-tight">
        Отзывы студентов
      </SectionHeading>
    </div>
    
    <div className={`${LAYOUT.grid} ${SPACING.gapSemantic}`}>
      {CONENT_RESOURCES.testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </div>
  </section>
) 