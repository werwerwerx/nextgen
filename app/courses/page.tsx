import { PageContainer } from "@/components/continer";
import { GradientSectionHeading } from "@/components/ui/typography";
import { getCources } from "@/features/cource/cource.api";
import { SPACING } from "@/components/main-page-ui/constants";
import { Footer } from "@/components/ui/footer";
import { Metadata } from "next";
import { CourseList } from "@/components/CourseList/index";

// Перекэшируем каждые 5 минут для быстрого обновления видимости курсов
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Все курсы",
  description: "Изучите наши образовательные программы и выберите подходящий курс для старта вашей карьеры в IT",
  openGraph: {
    title: "Все курсы | NextGen Appletown",
    description: "Изучите наши образовательные программы и выберите подходящий курс для старта вашей карьеры в IT",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Курсы NextGen Appletown",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Все курсы | NextGen Appletown",
    description: "Изучите наши образовательные программы и выберите подходящий курс для старта вашей карьеры в IT",
    images: ["/opengraph-image.png"],
  },
};

export default async function CoursesPage() {
  const courses = await getCources();

  return (
    <>
      <PageContainer>
        <div className={`flex flex-col ${SPACING.gapHead} mt-20 w-full`}>
          <div className="!text-start w-full">
            <GradientSectionHeading
              text="Курсы Neural University"
              className="!text-start"
            />
          </div>

          <div className={`${SPACING.gapSemantic} flex flex-col w-full`}>
            <CourseList
              courses={courses}
              title="Все курсы"
              itemsPerPage={8}
            />
          </div>
        </div>
      </PageContainer>
      <Footer courses={courses} />
    </>
  );
}
