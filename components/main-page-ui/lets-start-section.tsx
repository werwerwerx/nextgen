"use client";
import { GradientLargeHeading, Subtitle } from "../ui/typography";
import { SPACING } from "./constants";
import { CONENT_RESOURCES } from "./content-resources";
import BlurText from "@/components/ui/blur-text";
import { LeadRequestFormFeature } from "@/features/lead/lead-request/lead-request-form.feature";

function LetsStartTextContent() {
  return (
    <div className={`${SPACING.gapHead} flex z-10 flex-col`}>
      <BlurText
        text={CONENT_RESOURCES.lets_start.title}
        delay={150}
        animateBy="words"
        direction="top"
        className="text-2xl md:text-4xl lg:text-5xl font-semibold !text-center py-2"
        spanClassName="text-primary drop-shadow-[0_19px_10px_hsl(var(--primary)_/_0.3)]"
        animationFrom={{ filter: "blur(10px)", opacity: 0, y: -50 }}
        animationTo={[
          { filter: "blur(5px)", opacity: 0.5, y: 5 },
          { filter: "blur(0px)", opacity: 1, y: 0 },
        ]}
        onAnimationComplete={() => {}}
      />
      <Subtitle className="text-center ">
        {CONENT_RESOURCES.lets_start.subtitle}
      </Subtitle>
    </div>
  );
}

export const LetsStartSection = () => {
  return (
    <>
      <div className={`w-full flex flex-col md:flex-col items-center justify-center ${SPACING.gapSemantic}`}>
        <LetsStartTextContent />

          <LeadRequestFormFeature />
      </div>
    </>
  );
};
