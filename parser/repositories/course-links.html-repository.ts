import { CheerioAPI, load } from "cheerio";
import type { CourseLink } from "../shared/course";
import { CONFIG } from "../config/constants";
import { ParseError } from "../shared/report";

export class CourseLinksHtmlRepository {
  private isMainCourseLinkByDomain(link: string): boolean {
    const domain = new URL(link).hostname;
    if (domain !== "neural-university.ru" && domain !== "uii-courses.ru") {
      throw new Error("unexpected domain for course link: " + link);
    }
    return domain === "neural-university.ru";
  }

  getCoursesLinks($: CheerioAPI): {
    newCourses: CourseLink[];
    mainCourses: CourseLink[];
  } {
    const submenuNewCourcesMenu = $(`.t794[data-tooltip-hook="#courses"]`)
      .first()
      .find(`ul.t794__list`)
      .first();
    const submenuDomainCourcesDiv = $(
      `div[data-submenu-hook="link_sub2_744311034"]`
    ).first();

    const newCources: CourseLink[] = [];
    const mainCources: CourseLink[] = [];

    submenuDomainCourcesDiv
      .find("li.t-menusub__list-item")
      .each((_, element) => {
        const link = $(element).find("a.t-menusub__link-item").first();
        const href = link.attr("href");
        const title = link.text();

        if (href && title) {
          const url = new URL(href, CONFIG.baseMainCoursesUrl).toString();
          if (this.isMainCourseLinkByDomain(url)) {
            mainCources.push({
              url,
              title: title.trim(),
              as: "MAIN",
            });
          } else {
            newCources.push({
              url,
              title: title.trim(),
              as: "NEW",
            });
          }
        }
      });

    submenuNewCourcesMenu.find(`li.t794__list_item`).each((_, element) => {
      const link = $(element).find(`a.t794__typo`).first();
      const href = link.attr("href");
      const title = link.text();

      if (href && title) {
        const url = new URL(href, CONFIG.baseMainCoursesUrl).toString();
        if (!this.isMainCourseLinkByDomain(url)) {
          newCources.push({
            url,
            title: title.trim(),
            as: "NEW",
          });
        }
      }
    });

    if (mainCources.length === 0 && newCources.length === 0) {
      throw new ParseError({
        clientErrorMessage:
          "Не удалось найти ссылки на курсы, вероятно страница не соответствует ожидаемой структуре",
        error:
          "No courses found in HTML, \n  selectors: [" +
          `.t794[data-tooltip-hook="#courses"] > ul.t794__list > li.t794__list_item > a.t794__typo` +
          "\n" +
          `div[data-submenu-hook="link_sub2_744311034"] > li.t-menusub__list-item > a.t-menusub__link-item` +
          "\n" +
          "]",
        url: "",
        title: "",
      });
    }

    return {
      newCourses: newCources,
      mainCourses: mainCources,
    };
  }
}
