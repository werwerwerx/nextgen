export interface CourseLink {
  title: string;
  as: "MAIN" | "NEW";
  url: string;
} 


export type MainCourse = {
  title: string;
  slug: string;
  type: "MAIN";
  pricesStartFrom: string | null;
  description: string;
  price: TariffPrice[];
  origin_url: string;
  installmentPlan: InstallmentPlan;
}

export type NewCource = {
  title: string;
  slug: string;
  type: "NEW";
  description: string;
  origin_url: string;
}


export type TariffName = "LIGHT" | "PRO" | "PRO MAX" | "CONSULTING";

export type TariffPrice = {
  name: TariffName;
  price: string;
}

export type InstallmentPlan = Record<TariffName, Partial<{
  "12": string;
  "24": string;
  "36": string;
}>>