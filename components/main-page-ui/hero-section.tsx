import { MainHeading, Subtitle } from "@/components/ui/typography";
import { SPACING } from "@/components/main-page-ui/constants";
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources";
import { LinkButton } from "@/components/ui/link-button";

export const HeroSection = () => (
  <section className={`w-full flex flex-col md:flex-row items-center`}>
    <div
      className={`w-full md:max-w-[80%] flex flex-col items-start justify-center ${SPACING.gapHead}`}
    >
      <div className={`${SPACING.gapHead} flex flex-col w-[76%]`}>
        <MainHeading className="text-start">
          {CONENT_RESOURCES.who_we_are.title}
        </MainHeading>
        <Subtitle className="text-start">
          {CONENT_RESOURCES.who_we_are.subtitle}
        </Subtitle>
      </div>
      <LinkButton href="#lets-start">
        Начать обучение
      </LinkButton>
    </div>
    <div className="w-[50%] flex items-center justify-center"></div>
  </section>
);
