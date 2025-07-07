import { CourseUnion, MainCourse } from "./course.types";

export const isMainCourse = (course: CourseUnion): course is MainCourse => {
  return course.type === "MAIN";
};

export const createCourseQuery = (courses: CourseUnion[]) => ({
  main: () => {
    const mainCourses = courses.filter(isMainCourse);
    return {
      byPopularity: (direction: "asc" | "desc" = "desc") =>
        mainCourses.sort((a, b) =>
          direction === "desc"
            ? b.popularity - a.popularity
            : a.popularity - b.popularity
        ),
      get: () => mainCourses
    };
  },
  new: () =>
    createCourseQuery(courses.filter((course) => course.type === "NEW")),
  get: () => courses,
});