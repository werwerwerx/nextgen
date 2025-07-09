import { HeroSection } from "@/components/main-page-ui/hero-section";
import { WhyItWorksSection } from "@/components/main-page-ui/why-it-works-section";
import { StatsSection } from "@/components/main-page-ui/stats-section";
import { TestimonialsSection } from "@/components/main-page-ui/testimonials-section";
import { CoursesSection } from "@/components/main-page-ui/cource-section";
import { PageContainer } from "@/components/continer";
import { Footer } from "@/components/ui/footer";
import { getCources } from "@/features/cource/cource.api";
import { LetsStartSection } from "@/components/main-page-ui/lets-start-section";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  description: "NextGen Appletown - ваш путь к успешной карьере в IT. Мы предлагаем лучшие курсы от Neural University с персональным подходом к каждому студенту.",
  openGraph: {
    title: "NextGen Appletown | Образовательная платформа",
    description: "NextGen Appletown - ваш путь к успешной карьере в IT. Мы предлагаем лучшие курсы от Neural University с персональным подходом к каждому студенту.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NextGen Appletown - Образовательная платформа",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen Appletown | Образовательная платформа",
    description: "NextGen Appletown - ваш путь к успешной карьере в IT. Мы предлагаем лучшие курсы от Neural University с персональным подходом к каждому студенту.",
    images: ["/opengraph-image.png"],
  },
};

export default async function Home() {
  const courses = await getCources();

  return (
    <>
      <PageContainer>
        <div className="  md:h-[66vh] w-full">
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
