import { ParseError } from '../shared/report';
import { CheerioAPI, load } from "cheerio";
import { CourseLink, TariffName, TariffPrice } from "../shared/course";
import { PRICES_START_FROM_QUERY, queryTarifPrices, NEW_COURSE_DESCRIPTION_QUERY_DEFAULT, NEW_COURSE_DESCRIPTION_FALLBACK_QUERY } from "../config/constants";
import { DESCRIPTION_QUERY } from "../config/constants";

export class CourseHtmlRepository {
  private cleanPriceText(text: string): string {
    return text.trim();
  }

  getDescription($: CheerioAPI): string {
    let description: string | null = null;

    description = $(DESCRIPTION_QUERY).first().text()?.trim() || null;
      
    if (!description) {
      description = $(NEW_COURSE_DESCRIPTION_FALLBACK_QUERY).first().text()?.trim() || null;
    }

    if(!description) {
      description = $(`[field="tn_text_1688847575603"]`).first().text()?.trim() || null;
    }
    if (!description) {
      description = $(NEW_COURSE_DESCRIPTION_QUERY_DEFAULT).first().attr('content')?.trim() || null;
    }


    if (!description) {
      // we expand metadata this on service level
      throw new ParseError({
        clientErrorMessage: "Не удалось найти описание курса, вероятно страница не соответствует ожидаемой структуре",
        error: `No description found in any of the selectors: '${DESCRIPTION_QUERY}', '${NEW_COURSE_DESCRIPTION_QUERY_DEFAULT}', '${NEW_COURSE_DESCRIPTION_FALLBACK_QUERY}'`,
        url: "",
        title: ""
      }
      );
    }

    return description;
  }

  async getCoursePrices($: CheerioAPI): Promise<[TariffPrice[], string | null]> {
    const prices: TariffPrice[] = [];
    for (const query of queryTarifPrices) {
      for (const [key, value] of Object.entries(query)) {
        const priceText = $(value).first().text();
        if (!priceText.trim()) {
          continue;
        }
        prices.push({ 
          name: key as TariffName, 
          price: this.cleanPriceText(priceText)
        });
      }
    }

    let pricesStartFrom = null;
    const pricesStartFromText = $(PRICES_START_FROM_QUERY).first().text();
      if (pricesStartFromText.trim()) {
        pricesStartFrom = this.cleanPriceText(pricesStartFromText);
      }
    return [prices, pricesStartFrom];
  }


}