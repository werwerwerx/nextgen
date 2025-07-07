import { CourseLinksHtmlRepository } from "../repositories/course-links.html-repository";
import type { MainCourse, CourseLink, NewCource } from "../shared/course";
import { HtmlLoaderService } from "./html-loader.service";
import { CourseHtmlRepository } from "../repositories/cource.html-repository";
import {
  DESCRIPTION_QUERY,
  queryTarifPrices,
} from "../config/constants";
import { ParseError, CourseParsingError } from "../shared/report";
import { CourceInstallmentPlanHTMLRepository } from "../repositories/cource.installment-plan.html.repository";
import { CheerioAPI } from "cheerio";

export class CourceService {
  private links: CourseLink[] = [];
  private delay = 2000;
  private errors: { courseLink: CourseLink; error: Error }[] = [];
  private courses: (MainCourse | NewCource)[] = [];

  constructor(
    private readonly courseLinksHtmlRepository: CourseLinksHtmlRepository,
    private readonly htmlLoaderService: HtmlLoaderService,
    private readonly courseHtmlRepository: CourseHtmlRepository,
    private readonly courceInstallmentPlanHTMLRepository: CourceInstallmentPlanHTMLRepository
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

      const courseInfoDescription = await this.courseHtmlRepository.getDescription($);
      const installmentPlan = this.courceInstallmentPlanHTMLRepository.extractInstallmentPlan($);

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
          title: link.title,
          slug: slug,
          type: "MAIN",
          description: courseInfoDescription,
          pricesStartFrom: startsFrom || null,
          price: prices,
          origin_url: link.url,
          installmentPlan: installmentPlan,
        };
      }
      return {
        title: link.title,
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

  async visitLinks(): Promise<{
    courses: (MainCourse | NewCource)[];
    errors: CourseParsingError[];
  }> {
    console.log("Starting to fetch course links...");
    await this.getCourseLinks();

    if (!this.links || this.links.length === 0) {
      throw new Error("No course links found");
    }

    console.log(`Found ${this.links.length} courses to process`);
    const parsingErrors: CourseParsingError[] = [];

    for await (const link of this.links) {
      console.log(`Processing course: ${link.title} (${link.url})`);
      try {
        const course = await this.extractCourseFromPage(link);
        this.courses.push(course);
        console.log(`Successfully processed course: ${course.title}`);
        await new Promise((resolve) => setTimeout(resolve, this.delay));
      } catch (error) {
        console.error(`Failed to process course: ${link.title}`, error instanceof Error ? error.message : "Unknown error");
        if (error instanceof ParseError) {
          parsingErrors.push({
            url: error.url || link.url,
            title: error.title || link.title,
            error: error.message,
            clientErrorMessage: error.clientErrorMessage
          });
        } else {
          parsingErrors.push({
            url: link.url,
            title: link.title,
            error: error instanceof Error ? error.message : "Unknown error",
            clientErrorMessage: "Неизвестная ошибка при обработке курса"
          });
        }
      }
    }

    if (this.courses.length === 0) {
      throw new Error("No courses were successfully processed");
    }

    console.log(`Finished processing. Successful: ${this.courses.length}, Failed: ${parsingErrors.length}`);
    return {
      courses: this.courses,
      errors: parsingErrors
    };
  }
}
