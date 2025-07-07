import { z } from "zod";

type BaseCourse = {
  title: string;
  id: number;
  description: string;
  origin_url: string;
  leadsInterestedCount: number;
  type: "MAIN" | "NEW";
}

export type TariffName = "LIGHT" | "PRO" | "PRO MAX" | "CONSULTING";

export type TariffPrice = {
  title: TariffName;
  price: string;
}

export type InstallmentPlan = {
  [K in TariffName]?: Partial<{
    "12": string;
    "24": string;
    "36": string;
  }>;
}

export type MainCourse = BaseCourse & {
  type: "MAIN";
  prices: Record<TariffName, string>;
  installmentPlanPriceFrom: string | null;
  popularity: number;
  is_active: boolean;
  installmentPlan: InstallmentPlan | null;
}

export type NewCourse = BaseCourse & {
  type: "NEW";
}

export type CourseUnion = MainCourse | NewCourse;

export const InstallmentPlanSchema = z.object({
  LIGHT: z.object({
    "12": z.string(),
    "24": z.string(),
    "36": z.string(),
  }).partial().optional(),
  PRO: z.object({
    "12": z.string(),
    "24": z.string(),
    "36": z.string(),
  }).partial().optional(),
  "PRO MAX": z.object({
    "12": z.string(),
    "24": z.string(),
    "36": z.string(),
  }).partial().optional(),
  CONSULTING: z.object({
    "12": z.string(),
    "24": z.string(),
    "36": z.string(),
  }).partial().optional(),
})