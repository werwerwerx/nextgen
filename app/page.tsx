import { HeroSection } from "@/components/main-page-ui/hero-section";
import { WhyItWorksSection } from "@/components/main-page-ui/why-it-works-section";
import { StatsSection } from "@/components/main-page-ui/stats-section";
import { TestimonialsSection } from "@/components/main-page-ui/testimonials-section";
import { CoursesSection } from "@/components/main-page-ui/cource-section";
import { PageContainer } from "@/components/continer";
import { Footer } from "@/components/ui/footer";
import { getCources } from "@/features/cource/cource.api";
import { LetsStartSection } from "@/components/main-page-ui/lets-start-section";

export const revalidate = 3600;


export default async function Home() {
  const courses = await getCources();

  return (
    <>
      <PageContainer>
        <div className="h-[66vh] w-full">
          <HeroSection />
        </div>

        <StatsSection />
        <TestimonialsSection />
        <WhyItWorksSection />
        
        {courses ?  <CoursesSection courses={courses} /> : null}

        <LetsStartSection />
      </PageContainer>
      <Footer courses={courses} />
    </>
  );
}
