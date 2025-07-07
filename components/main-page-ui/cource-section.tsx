"use client";
import { CourceCard } from "@/components/maincource.card";
import { CourseUnion } from "@/features/cource/course.types";
import { CONENT_RESOURCES } from "./content-resources";
import { SPACING } from "./constants";
import {
  GradientLargeHeading,
  GradientSectionHeading,
  Subtitle,
} from "../ui/typography";
import { ArrowUpRight } from "lucide-react";
import { createCourseQuery } from "@/features/cource/cource.util";
import { useRouter } from "next/navigation";

export const CoursesSection = ({ courses }: { courses: CourseUnion[] }) => {
  const mainPopularCourses = createCourseQuery(courses).main().byPopularity();
  const router = useRouter();
  return (
    <section
      className={`${SPACING.gapSemantic} px-4 w-full flex flex-col items-center justify-center`}
      id={CONENT_RESOURCES.courses.section_id}
    >
      <div className={`flex flex-col ${SPACING.gap} `}>
        <GradientSectionHeading text={CONENT_RESOURCES.courses.title || ""} />
        <Subtitle className="leading-relaxed">
          {CONENT_RESOURCES.courses.subtitle}
        </Subtitle>
      </div>
      <div
        className={`${SPACING.gapCards} w-full grid grid-cols-1 lg:grid-cols-2 auto-rows-fr`}
      >
        {mainPopularCourses.slice(0, 3).map((course) => (
          <CourceCard key={course.id} course={course} />
        ))}
        <div
          className={` w-full h-full flex bg-primary rounded-xl flex-col justify-center bg-none group transition-all duration-300 cursor-pointer`}
          onClick={() => router.push("/courses")}
        >
          <div className="flex flex-row gap-2 items-center justify-center p-5">
            <GradientLargeHeading className="text-start !text-3xl !font-normal group-hover:!text-foreground transition-all duration-300 !text-primary-foreground hover:text-foreground">
              Увидеть все курсы
            </GradientLargeHeading>
            <ArrowUpRight className="w-10 h-10 text-primary-foreground group-hover:text-foreground transition-all duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
};
