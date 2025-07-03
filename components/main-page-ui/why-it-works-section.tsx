import {
  GradientSectionHeading,
  Subtitle,
  SubHeading,
  BodyText,
} from "@/components/ui/typography";
import { SPACING, CARDS } from "@/components/main-page-ui/constants";
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources";
import { Brain, Users, Briefcase, Book, GraduationCap, MessageCircle, Award, Rocket, Lightbulb, Star } from "lucide-react";

const featureIcons = [
  Brain,
  Users,
  Briefcase,
  Book,
  GraduationCap,
  MessageCircle,
  Award,
  Rocket,
  Lightbulb,
  Star,
];

export const WhyItWorksSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic} `}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <GradientSectionHeading text={CONENT_RESOURCES.why_it_works.title} />
      <Subtitle className="leading-relaxed">
        {CONENT_RESOURCES.why_it_works.subtitle}
      </Subtitle>
    </div>
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-lg p-3 md:p-5"
    >
      {CONENT_RESOURCES.why_it_works.features.map((feature, index) => {
        const Icon = featureIcons[index % featureIcons.length] || Brain;
        return (
          <CardContainer key={feature.name}>
            <IconItem icon={<Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />} />
            <div className={`flex flex-col ${SPACING.gap}`}>
              <SubHeading className="text-base md:text-lg">
                {feature.name}
              </SubHeading>
              <BodyText className="text-sm md:text-base">
                {feature.description}
              </BodyText>
            </div>
          </CardContainer>
        );
      })}
    </div>
  </section>
);

function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex flex-col items-center text-center shadow-lg rounded-2xl bg-card/80 ${CARDS.base} ${CARDS.hover} p-5 md:p-8 ${SPACING.gap}`}
    >
      {children}
    </div>
  );
}

function IconItem({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 mb-3">
      {icon}
    </div>
  );
}
