"use client";
import { CourseUnion } from "@/features/cource/course.types";
import {
  BaseCourceCardContainer,
  CourceCardArrow,
  CourceCardBadge,
  CourceCardDecription,
  CourceCardTitle,
  CourseCardPrice,
  CourseTariffPrices,
} from "./cource.ui.base";
import { SPACING } from "@/components/main-page-ui/constants";
import { isMainCourse } from "@/features/cource/cource.util";
import { useRouter } from "next/navigation";

export const CourceCard = ({ course }: { course: CourseUnion }) => { 
  const router = useRouter();
  const isMain = isMainCourse(course);
  const minInstallment = isMain
    ? course.installmentPlanPriceFrom || course.installmentPlan?.LIGHT?.[12]
    : null; 

  console.log('Course data:', {
    isMain,
    prices: isMain ? course.prices : null,
    course
  });

  return (
    <BaseCourceCardContainer courseId={course.id} onClick={() => router.push(`/courses/${course.id}`)}>
      <div className={`w-full flex flex-col ${SPACING.gap}`}>
        <div className="w-full flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2 md:flex-row">
            {isMain && course.installmentPlan && (
              <CourceCardBadge>Доступна рассрочка!</CourceCardBadge>
            )}
            {isMain ? (
              <CourceCardBadge variant="outline">Основной курс</CourceCardBadge>
            ) : (
              <CourceCardBadge variant="outline">Новый курс</CourceCardBadge>
            )}
          </div>
          <CourceCardArrow />
        </div>
        <CourceCardTitle>{course.title}</CourceCardTitle>
        <CourceCardDecription description={course.description} />
      </div>
      <div className="flex flex-col gap-2 w-full mt-4">
        {isMain && course.type === "MAIN" && course.prices && (
          <CourseTariffPrices prices={course.prices} />
        )}
        {minInstallment && (
          <div className="flex flex-row justify-between items-center">
            <CourseCardPrice value={`от ${minInstallment} ₽/мес`} />
          </div>
        )}
      </div>
    </BaseCourceCardContainer>
  );
};
