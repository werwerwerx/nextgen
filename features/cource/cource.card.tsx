"use client";
import { DbCourse } from "@/lib/types";
import { CARDS, SPACING } from "@/components/main-page-ui/constants";
import {
  BodyText,
  GradientLargeHeading,
  GradientSectionHeading,
  MainHeading,
  Subtitle,
} from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

type CourceCardProps = {
  course: DbCourse;
};

export const CourceCard = ({ course }: CourceCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div
      className={`${CARDS.base} ${CARDS.hover} ${SPACING.gapSemantic} shadow-md rounded-xl p-10 w-full text-foreground h-full flex flex-col justify-between bg-background hover:bg-primary group transition-all duration-300 cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`flex flex-col ${SPACING.gapHead}`}>
        <CourceCardTitle value={course.course_name} />
        <CourceCardDecription description={course.description} />
      </div>
      <div className="flex flex-row gap-2 w-full justify-between items-center">
        <CourseCardPrice value={`от ${course.price_starts_from} ₽`} />
        <ArrowUpRight className="w-10 h-10 hover:text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary-foreground" />
      </div>
    </div>
  );
};

// text content
const CourceCardTitle = ({ value }: { value: string }) => (
  <GradientLargeHeading className="text-start !text-3xl group-hover:!text-foreground transition-all duration-300 line-clamp-2">
    {value}
  </GradientLargeHeading>
);

const CourseCardPrice = ({ value }: { value: string }) => (
  <MainHeading className="text-start !text-3xl group-hover:!text-primary-foreground transition-all duration-300">
    {value}
  </MainHeading>
);

const CourceCardDecription = ({ description }: { description: string }) => (
  <BodyText className="text-start  group-hover:!text-foreground/70 transition-all duration-300 line-clamp-3">
    {description}
  </BodyText>
);
