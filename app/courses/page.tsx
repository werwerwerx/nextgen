import { PageContainer } from "@/components/continer";
import { GradientSectionHeading, SubHeading } from "@/components/ui/typography";
import { getCources } from "@/features/cource/cource.api";
import { createCourseQuery } from "@/features/cource/cource.util";
import { CourceCard } from "@/components/maincource.card";
import { SPACING } from "@/components/main-page-ui/constants";
import { Footer } from "@/components/ui/footer";

export const revalidate = 3600;

export default async function CoursesPage() {
  const courses = await getCources();
  const courseQuery = createCourseQuery(courses);

  const mainCourses = courseQuery.main().byPopularity("desc");
  const newCourses = courseQuery.new().get();

  return (
    <>
      <PageContainer>
        <div className={`flex flex-col ${SPACING.gapHead} mt-20`}>
          <div className="!text-start w-full">
            <GradientSectionHeading
              text="Курсы Neural University"
              className="!text-start"
            />
          </div>

          <div className={`${SPACING.gapSemantic} flex flex-col`}>
            <div className="flex flex-col gap-6 text-start items-start">
              <SubHeading className="!text-start !text-3xl">
                Основные курсы
              </SubHeading>
              <div
                className={`${SPACING.gapCards} w-full grid grid-cols-1 lg:grid-cols-2 auto-rows-fr`}
              >
                {mainCourses.map((course) => (
                  <CourceCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 text-start items-start">
              <SubHeading className="!text-start !text-3xl">
                Новые курсы
              </SubHeading>
              <div
                className={`${SPACING.gapCards} w-full grid grid-cols-1 lg:grid-cols-2 auto-rows-fr`}
              >
                {newCourses.map((course) => (
                  <CourceCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <Footer courses={courses} />
    </>
  );
}
