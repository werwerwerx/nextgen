import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../lib/supabase";
import { ParseReport } from "../shared/report";
import { DatabaseError } from "../shared/report";

export class ReportRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async saveReport(report: ParseReport) {
    try {
      const { data, error } = await this.supabase.from('parse_report').insert([{
        avg_parse_time: Math.round(report.performance.averageParseTime),
        total_parse_time: Math.round(report.performance.totalParseTime),
        total_courses_parsed: report.stats.totalLinksParsed,
        duration: Math.round(report.duration).toString(),
        total_updated: report.stats.updatedInDb,
      }]).select().single()

      if (error) {
        throw new DatabaseError({
          error: error.message,
          clientErrorMessage: "Не удалось сохранить отчет о парсинге"
        });
      }

      if (!data) {
        throw new DatabaseError({
          error: "No data returned after insert",
          clientErrorMessage: "Не удалось сохранить отчет о парсинге"
        });
      }

      if (report.errors.parsing.length > 0) {
        const { error: error2 } = await this.supabase.from('parse_error').insert(
          report.errors.parsing.map(error => ({
            error_msg: error.error,
            client_error_msg: error.clientErrorMessage,
            course_title: error.title,
            url: error.url,
            type: 'parsing',
            report_id: data.id,
          }))
        ).select()

        if (error2) {
          throw new DatabaseError({
            error: error2.message,
            clientErrorMessage: "Не удалось сохранить ошибки парсинга"
          });
        }
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError({
        error: error instanceof Error ? error.message : "Unknown database error",
        clientErrorMessage: "Произошла неизвестная ошибка при сохранении отчета"
      });
    }
  }
}