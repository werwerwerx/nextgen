import { TariffName } from "../shared/course";

export const CONFIG = {
  baseMainCoursesUrl: "https://neural-university.ru/",
  baseNewCoursesUrl: "https://uii-courses.ru/",
} as const;




const queryTarifPrices: Record<TariffName, string>[] = [
  {
    LIGHT: '[field="tn_text_1688463893435"]',
    PRO: '[field="tn_text_1688463893532"]',
    "PRO MAX": '[field="tn_text_1688463893679"]',
    CONSULTING: '[field="tn_text_1710788228313"]',
  },
];

export { queryTarifPrices };

export const PRICES_START_FROM_QUERY = '[field="tn_text_1687891016986"]';
export const DESCRIPTION_QUERY = '[field="tn_text_1687891016961"]';

export const TITLE_QUERY = 'title:first-of-type';
export const NEW_COURSE_DESCRIPTION_QUERY_DEFAULT = 'meta[name="description"]';
export const NEW_COURSE_DESCRIPTION_FALLBACK_QUERY = '[field="tn_text_1688845799332"]';

export const installmentPlanQueriesMap: Record<TariffName, {
  "12": string;
  "24": string;
  "36": string;
}> = {
  LIGHT: {
    "12": '[field="tn_text_1688463893452"]',
    "24": '[field="tn_text_1688463893456"]',
    "36": '[field="tn_text_1691147652121"]',
  },
  PRO: {
    "12": '[field="tn_text_1688463893556"]',
    "24": '[field="tn_text_1688463893561"]',
    "36": '[field="tn_text_1691147634278"]',
  },
  "PRO MAX": {
    "12": '[field="tn_text_1688463893656"]',
    "24": '[field="tn_text_1688463893667"]',
    "36": '[field="tn_text_1688463893671"]',
  },
  CONSULTING: {
    "12": '[field="tn_text_1710788228428"]',
    "24": '[field="tn_text_1710788228539"]',
    "36": '[field="tn_text_1710788228580"]',
  },
}