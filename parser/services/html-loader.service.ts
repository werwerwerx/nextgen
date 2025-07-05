import { CONFIG } from "../config/constants";
import { CheerioAPI, load } from "cheerio";
import { ParseError } from "../types/report";

export class HtmlLoaderService {
  private async fetchWithRetry(url: string, retries: number = 3, delay: number = 1000): Promise<Response> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, retries - 1, delay * 2);
      }
      throw new ParseError({
        error: `Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        clientErrorMessage: "Не удалось загрузить страницу курса",
        url,
        title: ""
      });
    }
  }

  async loadHtml(url: string): Promise<string> {
    const response = await this.fetchWithRetry(url);
    return response.text();
  }

  async load(url: string = CONFIG.baseMainCoursesUrl): Promise<CheerioAPI> {
    try {
      const html = await this.loadHtml(url);
      return load(html);
    } catch (error) {
      throw new ParseError({
        clientErrorMessage:
          "Не удалось загрузить HTML после трёх попыток, вероятно страница не доступна",
        error: error instanceof Error ? error.message : "Unknown error",
        url: url,
        title: "",
      });
    }
  }
}