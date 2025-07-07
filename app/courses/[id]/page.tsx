import { LeadRequestForm } from "@/features/lead/lead-request/lead-request";
import { PageContainer } from "@/components/continer";
import { GradientSectionHeading, SectionHeading, Subtitle } from "@/components/ui/typography";
import { getCourseById } from "@/features/cource/cource.api";
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  
  const course = await getCourseById(courseId);
  
  if (!course) {
    notFound();
  }

  return (
    <PageContainer className="min-h-[80vh] md:min-h-[90vh] justify-center py-2 px-4 md:px-8">
      <div className="flex flex-col items-center md:items-start gap-8 w-full max-w-md mx-auto">
        <div className="text-center md:text-start space-y-4 mb-4 w-full">
          <GradientSectionHeading 
            className="!font-semibold !text-center md:!text-start !text-4xl" 
            text={course.title}
          />
          <Subtitle className="text-center md:text-start">
            оставьте заявку и мы свяжемся с вами для начала обучения
          </Subtitle>
        </div>
        <LeadRequestForm courseId={courseId} />
      </div>
    </PageContainer>
  );
}
