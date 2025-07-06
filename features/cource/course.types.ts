export type baseCourse = {
  title: string;
  description: string;
  origin_url: string;
  type: "MAIN" | "NEW";
}

export type TariffName = "LIGHT" | "PRO" | "PRO MAX" | "CONSULTING";
export type MainCourse = {
  type: "MAIN";
  prices: Record<TariffName, string>;
  installmentPlanPriceFrom: string | null;
  popularity: number // count leads interested in course
  is_active: boolean
} & baseCourse 

export type NewCourse = {
  type: "NEW";
} & baseCourse 
