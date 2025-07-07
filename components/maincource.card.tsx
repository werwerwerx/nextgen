"use client";
import { CourseUnion } from "@/features/cource/course.types";
import {
  BaseCourceCardContainer,
  CourceCardArrow,
  CourceCardBadge,
  CourceCardDecription,
  CourceCardTitle,
  CourseCardPrice,
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
  return (
    <BaseCourceCardContainer courseId={course.id} onClick={() => router.push(`/courses/${course.id}`)}>
      <div className={`w-full flex flex-col ${SPACING.gap}`}>
        <div className="w-full flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2 md:flex-row">
            {isMainCourse(course) && course.installmentPlan && (
              <CourceCardBadge>Доступна рассрочка!</CourceCardBadge>
            )}
            {isMainCourse(course) ? (
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
      <div className="flex flex-row gap-2 w-full justify-between items-center mt-4">
        {minInstallment ? (
          <CourseCardPrice value={`от ${minInstallment} ₽/мес`} />
        ) : null}
      </div>
    </BaseCourceCardContainer>
  );
};
