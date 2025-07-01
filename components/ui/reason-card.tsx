import { Card, CardContent } from "@/components/ui/card"
import { BodyText, SubHeading, SmallText } from "@/components/ui/typography"
import { CARDS, SPACING } from "@/components/main-page-ui/constants"
import { Reason } from "@/lib/types/content"
import { MessageSquare } from "lucide-react"

interface ReasonCardProps {
  reason: Reason
}

export const ReasonCard = ({ reason }: ReasonCardProps) => (
  <Card className={CARDS.hover}>
    <CardContent className={CARDS.content}>
      <div className={`flex flex-col ${SPACING.gapSemantic}`}>
        <MessageSquare className="text-primary h-6 w-6" />
        <BodyText className="text-muted-foreground italic leading-relaxed">
          &ldquo;{reason.claim}&rdquo;
        </BodyText>
        <div className={`flex flex-col ${SPACING.gap}`}>
          <SubHeading className="text-foreground">{reason.author}</SubHeading>
          <SmallText>{reason.source}</SmallText>
        </div>
      </div>
    </CardContent>
  </Card>
) 