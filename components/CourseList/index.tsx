"use client";
import { useState } from "react";
import { SubHeading } from "@/components/ui/typography";
import { CourceCard } from "@/components/maincource.card";
import { SPACING } from "@/components/main-page-ui/constants";
import { CourseUnion } from "@/features/cource/course.types";
import { isMainCourse } from "@/features/cource/cource.util";

type CourseListProps = {
  courses: CourseUnion[];
  title: string;
  itemsPerPage?: number;
};

const CourseList = ({ courses, title, itemsPerPage = 6 }: CourseListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "main" | "popular">("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "new" && course.type === "NEW") ||
      (filter === "main" && course.type === "MAIN") ||
      (filter === "popular" && course.type === "MAIN");
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (filter === "popular") {
      const popularityA = isMainCourse(a) ? a.popularity : 0;
      const popularityB = isMainCourse(b) ? b.popularity : 0;
      return popularityB - popularityA;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 text-start items-start w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SubHeading className="!text-start !text-3xl !text-nowrap">{title}</SubHeading>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="Поиск курсов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "new" | "main" | "popular")}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все курсы</option>
            <option value="new">Новые курсы</option>
            <option value="main">Основные курсы</option>
            <option value="popular">По популярности</option>
          </select>
        </div>
      </div>

      <div className={`${SPACING.gapCards} w-full min-h-[600px] grid grid-cols-1 lg:grid-cols-2 auto-rows-fr relative`}>
        {paginatedCourses.length > 0 ? (
          paginatedCourses.map((course) => (
            <CourceCard key={course.id} course={course} />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
            По вашему запросу ничего не найдено
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 w-full mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { CourseList }; 