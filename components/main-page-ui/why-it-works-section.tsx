import {
  GradientSectionHeading,
  Subtitle,
  SubHeading,
  BodyText,
  SmallText,
} from "@/components/ui/typography";
import { SPACING, LAYOUT } from "@/components/main-page-ui/constants";
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources";
import { Brain, Users, Briefcase } from "lucide-react";

const featureIcons = [Brain, Users, Briefcase];

export const WhyItWorksSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic} border `}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <GradientSectionHeading text={CONENT_RESOURCES.why_it_works.title} />
      <Subtitle className="leading-relaxed">
        {CONENT_RESOURCES.why_it_works.subtitle}
      </Subtitle>
    </div>
    <div
      className={` ${SPACING.gap} flex flex-col md:flex-row bg-primary rounded-lg p-5 py-5 `}
    >
      {CONENT_RESOURCES.why_it_works.features.map((feature, index) => {
        const Icon = featureIcons[index] || Brain;
        return (
          <CardContainer key={feature.name} isLast={index === CONENT_RESOURCES.why_it_works.features.length - 1}>
            <IconItem
              icon={<Icon className="w-10 h-10" />}
            />

            <div className={`flex flex-col ${SPACING.gap}`}>
              <SubHeading className="text-primary-foreground">
                {feature.name}
              </SubHeading>
              <BodyText className="text-primary-foreground/70">
                {feature.description}
              </BodyText>
            </div>
          </CardContainer>
        );
      })}
    </div>
  </section>
);

function CardContainer({ children, isLast }: { children: React.ReactNode, isLast: boolean }) {
  return (
    <div className={`flex flex-col ${isLast ? "" : "border-r"} items-start border-right text-start text-primary shadow-lg/80 shadow-primary-foreground p-3  ${SPACING.gap} py-10`}>
      {children}
    </div>
  );
}

function IconItem({
  icon,
}: {
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-start bg-background text-primary border-primary-foreground shadow-lg/80 shadow-primary-foreground rounded-full p-3">
      {icon}
    </div>
  );
}
