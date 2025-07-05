import { CourseLinksHtmlRepository } from "../repositories/course-links.html-repository";
import type { MainCourse, CourseLink, NewCource } from "../types/course";
import { HtmlLoaderService } from "./html-loader.service";
import { CourseHtmlRepository } from "../repositories/cource.html-repository";
import {
  TITLE_QUERY,
  DESCRIPTION_QUERY,
  queryTarifPrices,
} from "../config/constants";
import { ParseError } from "../types/report";

export class CourceService {
  private links: CourseLink[] = [];
  private delay = 2000;
  private errors: { courseLink: CourseLink; error: Error }[] = [];
  private courses: (MainCourse | NewCource)[] = [];

  constructor(
    private readonly courseLinksHtmlRepository: CourseLinksHtmlRepository,
    private readonly htmlLoaderService: HtmlLoaderService,
    private readonly courseHtmlRepository: CourseHtmlRepository
  ) {}

  private async extractCourseFromPage(
    link: CourseLink
  ): Promise<MainCourse | NewCource> {
    try {
    const $ = await this.htmlLoaderService.load(link.url);
    const url = new URL(link.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slug = pathSegments[pathSegments.length - 1];

    if (!slug) {
      throw new ParseError({
        clientErrorMessage: `Не удалось получить slug из URL: ${link.url}`,
        error: `Invalid URL structure - no slug found: ${link.url}`,
        url: link.url,
        title: link.title
      });
    }

    const title = $(TITLE_QUERY).text().trim();
    if (!title) {
      throw new ParseError({
        clientErrorMessage: `Не удалось получить title из HTML элемента '${TITLE_QUERY}' для курса: ${link.url}`,
        error: `No title found in HTML element '${TITLE_QUERY}' for course: ${link.url}`,
        url: link.url,
        title: link.title
      });
    }
      const courseInfoDescription = await this.courseHtmlRepository.getDescription($);
    

    if (link.as === "MAIN") {
      const [prices, startsFrom] =
        await this.courseHtmlRepository.getCoursePrices($);
      if (!prices || prices.length === 0) {
        console.warn(
          `WARN: No prices found in HTML elements ${Object.values(
            queryTarifPrices[0]
          ).join(", ")} for course: ${link.url}`
        );
      }
      return {
        title: title,
        slug: slug,
        type: "MAIN",
        description: courseInfoDescription,
        pricesStartFrom: startsFrom || null,
        price: prices,
        origin_url: link.url,
      };
    }
    return {
      title,
      slug,
      type: "NEW",
      description: courseInfoDescription,
      origin_url: link.url,
    };
  } catch (error) {
    if (error instanceof ParseError) {
      error.url = link.url;
      error.title = link.title;
      throw error;
    }
    throw error;
  }
  }

  private async getCourseLinks(): Promise<void> {
    const $ = await this.htmlLoaderService.load();
    try {
      const { mainCourses, newCourses } =
        this.courseLinksHtmlRepository.getCoursesLinks($);
      this.links = [...mainCourses, ...newCourses];
    } catch (error) {
      console.error("Failed to get course links:", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async visitLinks(): Promise<(MainCourse | NewCource)[]> {
    console.log("Starting to fetch course links...");
    await this.getCourseLinks();

    if (!this.links || this.links.length === 0) {
      throw new Error("No course links found");
    }

    console.log(`Found ${this.links.length} courses to process`);

    for await (const link of this.links) {
      console.log(`Processing course: ${link.title} (${link.url})`);
      try {
        const course = await this.extractCourseFromPage(link);
        this.courses.push(course);
        console.log(`Successfully processed course: ${course.title}`);
        await new Promise((resolve) => setTimeout(resolve, this.delay));
      } catch (error) {
        console.error(`Failed to process course: ${link.title}`, error instanceof Error ? error.message : "Unknown error");
        this.errors.push({
          courseLink: link,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    }

    if (this.courses.length === 0) {
      throw new Error("No courses were successfully processed");
    }

    console.log(`Finished processing. Successful: ${this.courses.length}, Failed: ${this.errors.length}`);
    return this.courses;
  }
}
