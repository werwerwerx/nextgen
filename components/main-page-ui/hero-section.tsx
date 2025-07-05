import { MainHeading, Subtitle } from "@/components/ui/typography";
import { SPACING } from "@/components/main-page-ui/constants";
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources";
import { LinkButton } from "@/components/ui/link-button";
import Image from "next/image";

export const HeroSection = () => (
  <section className={`w-full h-full flex flex-col md:flex-row items-center justify-start relative text-center md:text-start`} id={CONENT_RESOURCES.who_we_are.section_id}>

    {/* image hero */}
    <Image 
      src="/hero-section-image.png" 
      alt="Hero Section Image" 
      width={610}
      height={610}
      priority
      quality={100}
      className="block md:absolute bottom-0 object-cover right-0 top-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[610px] lg:h-[610px] mb-6 md:mb-0 -ml-8 md:ml-0" 
    />

    {/* hero text content */}
    <div
      className={`w-full flex flex-col md:max-w-[50%] items-center md:items-start justify-center ${SPACING.gapHead}`}
    >
      <div className={`${SPACING.gapHead} flex flex-col z-10`}>
        <MainHeading className="text-center md:text-start">
          {CONENT_RESOURCES.who_we_are.title}
        </MainHeading>
        <Subtitle className="text-center md:text-start">
          {CONENT_RESOURCES.who_we_are.subtitle}
        </Subtitle>
      </div>
      <LinkButton href="#lets-start" className="h-14">
        Начать обучение
      </LinkButton>
    </div>
  </section>
);
