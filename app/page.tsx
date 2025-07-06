import { HeroSection } from "@/components/main-page-ui/hero-section";
import { WhyItWorksSection } from "@/components/main-page-ui/why-it-works-section";
import { StatsSection } from "@/components/main-page-ui/stats-section";
import { TestimonialsSection } from "@/components/main-page-ui/testimonials-section";
import { LetsStartSection } from "@/components/main-page-ui/lets-start-section";
import { createClient } from "@supabase/supabase-js";
import { CoursesSection } from "@/components/main-page-ui/cource-section";
import { PageContainer } from "@/components/continer";
import { Footer } from "@/components/ui/footer";

export const revalidate = 3600;

async function getCourses() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: courses } = await supabase
    .from("cources")
    .select("*")
    .order("created_at", { ascending: false });

  return courses || [];
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <>
      <PageContainer>
        <div className="h-[66vh] w-full">
          <HeroSection />
        </div>

        <StatsSection />
        <TestimonialsSection />
        <WhyItWorksSection />
        <CoursesSection courses={courses} />
        <LetsStartSection
          mayInterstedIn={courses.map((course) => ({
            title: course.course_name,
            origin_url: course.origin_url,
          }))}
        />
      </PageContainer>
      <Footer courses={courses} />
    </>
  );
}
