"use client";
import {  Subtitle } from "../ui/typography";
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
        className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold !text-center py-2"
        animationFrom={{ filter: "blur(10px)", opacity: 0, y: -50 }}
        animationTo={[
          { filter: "blur(5px)", opacity: 0.5, y: 5 },
          { filter: "blur(0px)", opacity: 1, y: 0 },
        ]}
        onAnimationComplete={() => {}}
      />
      <Subtitle className="text-center text-primary-foreground/70">
        {CONENT_RESOURCES.lets_start.subtitle}
      </Subtitle>
    </div>
  );
}

export const LetsStartSection = () => {
  return (
    <>
      <div className={`w-full flex py-10 md:py-20 text-primary-foreground rounded-lg flex-col items-center justify-center ${SPACING.gapSemantic} bg-transparent md:px-20 bg-gradient-to-r from-primary to-purple-500`}>
        <LetsStartTextContent />
        <div className="px-2">
        <LeadRequestFormFeature/>

        </div>
      </div>
    </>
  );
};
