import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import {
  CourseUnion,
  TariffName,
  InstallmentPlanSchema,
} from "./course.types";
import { SupabaseError } from "@/lib/supabase/types";
import { z } from "zod";

type Course = Database["public"]["Tables"]["cources"]["Row"];
type Lead = Database["public"]["Tables"]["leads"]["Row"];


const tariffPriceSchema = z.array(
  z.object({
    name: z.enum(["LIGHT", "PRO", "PRO MAX", "CONSULTING"]),
    price: z.string(),
  })
);


export const getCources = async (): Promise<CourseUnion[] > => {
    const client = await createClient();
  
    const [
      { data: courses, error: coursesError },
      { data: courseLeads, error: courseLeadsError },
    ] = await Promise.all([
      client.from("cources").select("*").eq("is_active", true),
      client.from("user_course").select("*").eq("is_active", true),
    ]);
  
    if (coursesError)
      throw new SupabaseError(
        "Error fetching courses",
        coursesError,
        "Упс! Произошла ошибка при получении курсов! :("
      );
  
    if (!courses) return [];

  
    return courses.map((course): CourseUnion => {
      if (course.type === "MAIN") {
        const prices = tariffPriceSchema.safeParse(course.tariff_price);
        
        let parsedInstallmentPlan = null;
        if (course.installment_plan_map) {
          try {
            if (typeof course.installment_plan_map === 'string') {
              parsedInstallmentPlan = JSON.parse(course.installment_plan_map);
            } else {
              parsedInstallmentPlan = course.installment_plan_map;
            }
          } catch (e) {
            console.error('Failed to parse installment plan:', e);
          }
        }

        const installmentPlan = InstallmentPlanSchema.safeParse(parsedInstallmentPlan);

        const pricesRecord: Record<TariffName, string> = {
          LIGHT: "",
          PRO: "",
          "PRO MAX": "",
          CONSULTING: "",
        };
  
        if (prices.success) {
          prices.data.forEach((p) => {
            pricesRecord[p.name] = p.price;
          });
        }
  
        return {
          type: "MAIN",
          title: course.course_name,
          description: course.description || "",
          origin_url: course.origin_url,
          prices: pricesRecord,
          installmentPlanPriceFrom: course.price_starts_from,
          popularity:
            courseLeads?.filter((lead) => lead.course_id === course.id).length ||
            0,
          is_active: course.is_active,
          installmentPlan: installmentPlan.success ? installmentPlan.data : null,
          id: course.id,
          leadsInterestedCount: courseLeadsError
            ? 0
            : courseLeads?.filter((lead) => lead.course_id === course.id)
                .length || 0,
        };
      }
  
      return {
        type: "NEW",
        title: course.course_name,
        description: course.description || "",
        origin_url: course.origin_url,
        id: course.id,
        leadsInterestedCount:
          courseLeads?.filter((lead) => lead.course_id === course.id).length || 0,
      };
    });
};

export const getCourseById = async (id: number): Promise<CourseUnion | null> => {
  const client = await createClient();

  const [
    { data: course, error: courseError },
    { data: courseLeads, error: courseLeadsError },
  ] = await Promise.all([
    client.from("cources").select("*").eq("id", id).eq("is_active", true).single(),
    client.from("user_course").select("*").eq("is_active", true),
  ]);

  if (courseError) {
    throw new SupabaseError(
      "Error fetching course",
      courseError,
      "Упс! Произошла ошибка при получении курса! :("
    );
  }

  if (!course) return null;

  if (course.type === "MAIN") {
    const prices = tariffPriceSchema.safeParse(course.tariff_price);
    
    let parsedInstallmentPlan = null;
    if (course.installment_plan_map) {
      try {
        if (typeof course.installment_plan_map === 'string') {
          parsedInstallmentPlan = JSON.parse(course.installment_plan_map);
        } else {
          parsedInstallmentPlan = course.installment_plan_map;
        }
      } catch (e) {
        console.error('Failed to parse installment plan:', e);
      }
    }

    const installmentPlan = InstallmentPlanSchema.safeParse(parsedInstallmentPlan);

    const pricesRecord: Record<TariffName, string> = {
      LIGHT: "",
      PRO: "",
      "PRO MAX": "",
      CONSULTING: "",
    };

    if (prices.success) {
      prices.data.forEach((p) => {
        pricesRecord[p.name] = p.price;
      });
    }

    return {
      type: "MAIN",
      title: course.course_name,
      description: course.description || "",
      origin_url: course.origin_url,
      prices: pricesRecord,
      installmentPlanPriceFrom: course.price_starts_from,
      popularity:
        courseLeads?.filter((lead) => lead.course_id === course.id).length ||
        0,
      is_active: course.is_active,
      installmentPlan: installmentPlan.success ? installmentPlan.data : null,
      id: course.id,
      leadsInterestedCount: courseLeadsError
        ? 0
        : courseLeads?.filter((lead) => lead.course_id === course.id)
            .length || 0,
    };
  }

  return {
    type: "NEW",
    title: course.course_name,
    description: course.description || "",
    origin_url: course.origin_url,
    id: course.id,
    leadsInterestedCount:
      courseLeads?.filter((lead) => lead.course_id === course.id).length || 0,
  };
};
