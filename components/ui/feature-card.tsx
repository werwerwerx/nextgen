import { Card, CardContent } from "@/components/ui/card"
import { SubHeading, BodyText, SmallText } from "@/components/ui/typography"
import { CARDS, SPACING } from "@/components/main-page-ui/constants"
import { Feature } from "@/lib/types/content"

interface FeatureCardProps {
  feature: Feature
}

export const FeatureCard = ({ feature }: FeatureCardProps) => (
  <Card className={CARDS.hover}>
    <CardContent className={CARDS.content}>
      <div className={`flex flex-col ${SPACING.gap}`}>
        <SubHeading className="text-primary">{feature.name}</SubHeading>
        <BodyText className="text-muted-foreground">{feature.description}</BodyText>
        <SmallText>Источник: {feature.source}</SmallText>
      </div>
    </CardContent>
  </Card>
) 