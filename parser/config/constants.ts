import { TariffName } from "../types/course";

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