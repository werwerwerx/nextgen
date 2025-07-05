import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import { config } from "dotenv";
import { MainCourse, NewCource, TariffPrice } from "../types/course";
import { DatabaseError } from "../types/report";

config();

export class CourseDbRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase; 
  }

  private processedUrls: Set<string> = new Set();
  private processedTitles: Set<string> = new Set();

  private isDuplicate(course: MainCourse | NewCource): boolean {
    if (this.processedUrls.has(course.origin_url)) {
      console.log(`Skipping duplicate course by URL: ${course.origin_url}`);
      return true;
    }

    if (this.processedTitles.has(course.title)) {
      console.log(`Skipping duplicate course by title: ${course.title}`);
      return true;
    }

    this.processedUrls.add(course.origin_url);
    this.processedTitles.add(course.title);
    return false;
  }

  async saveCourses(courses: (MainCourse | NewCource)[]) {
    const uniqueCourses = courses.filter((course) => !this.isDuplicate(course));

    if (uniqueCourses.length === 0) {
      console.log("No new unique courses to save");
      return [];
    }

    const { data, error } = await this.supabase
      .from("cources")
      .upsert(
        uniqueCourses.map((course) => ({
          course_name: course.title,
          origin_url: course.origin_url,
          type: course.type,
          description: course.description,
          price_starts_from:
            course.type === "MAIN"
              ? (course as MainCourse).pricesStartFrom
              : null,
          tariff_price:
            course.type === "MAIN"
              ? JSON.stringify((course as MainCourse).price)
              : null,
        })),
        {
          onConflict: "origin_url",
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      throw new DatabaseError({
        error: error.message,
        clientErrorMessage: "Не удалось сохранить курсы в базу данных",
      });
    }
  }
}
