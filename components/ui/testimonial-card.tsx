import { Card, CardContent } from "@/components/ui/card"
import { BodyText, SubHeading, SmallText } from "@/components/ui/typography"
import { CARDS, SPACING } from "@/components/main-page-ui/constants"

interface TestimonialCardProps {
  testimonial: {
    text?: string
    claim?: string
    author: string
    source: string
    date?: string
  }
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <Card className={CARDS.hover}>
    <CardContent className={CARDS.content}>
      <div className={`flex flex-col ${SPACING.gapSemantic}`}>
        <BodyText className="text-muted-foreground italic leading-relaxed">
          &ldquo;{testimonial.text || testimonial.claim}&rdquo;
        </BodyText>
        <div className={`flex flex-col ${SPACING.gap}`}>
          <SubHeading className="text-primary">{testimonial.author}</SubHeading>
          <SmallText>
            {testimonial.source}
            {testimonial.date && ` • ${testimonial.date}`}
          </SmallText>
        </div>
      </div>
    </CardContent>
  </Card>
) 