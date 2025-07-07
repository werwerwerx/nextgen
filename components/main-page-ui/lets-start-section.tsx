"use client";
import { LeadRequestForm } from "@/features/lead/lead-request/lead-request";
import { SectionHeading, Subtitle } from "../ui/typography";
import { SPACING } from "./constants";
import { CONENT_RESOURCES } from "./content-resources";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const LetsStartSection = () => {
  const router = useRouter();
  
  return (
    <section
      className={`w-full flex py-10 md:py-20 text-primary-foreground rounded-lg flex-col items-center justify-center ${SPACING.gapSemantic} bg-transparent md:px-20 bg-gradient-to-r from-primary to-purple-500`}
      id={CONENT_RESOURCES.lets_start.section_id}
    >
          <div className={`${SPACING.gapHead} flex z-10 flex-col`}>
          <SectionHeading className="text-primary-foreground">
            {CONENT_RESOURCES.lets_start.title}
          </SectionHeading>
      <Subtitle className="text-center text-primary-foreground/70">
        {CONENT_RESOURCES.lets_start.subtitle}
      </Subtitle>
  </div>
      <LeadRequestForm />
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-primary-foreground/70 font-medium">
          или
        </div>
        <Button 
          variant="secondary" 
          onClick={() => router.push('/courses')}
          className="bg-background/10 !p-6 text-md font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
        >
          Выберите подходящий курс
        </Button>
      </div>
    </section>
  );
};
