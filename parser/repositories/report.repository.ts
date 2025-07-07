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
      console.log('Saving parse report with errors:', {
        totalErrors: report.errors.parsing.length,
        errors: report.errors.parsing.map(e => ({
          url: e.url,
          error: e.error,
          title: e.title
        }))
      });

      const { data, error } = await this.supabase.from('parse_report').insert([{
        avg_parse_time: Math.round(report.performance.averageParseTime),
        total_parse_time: Math.round(report.performance.totalParseTime),
        total_courses_parsed: report.stats.totalLinksParsed,
        duration: Math.round(report.duration).toString(),
        total_updated: report.stats.updatedInDb,
      }]).select().single();

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
        // Получаем все URLs из текущих ошибок
        const errorUrls = report.errors.parsing.map(error => error.url).filter(Boolean);

        console.log('Looking for existing errors with URLs:', errorUrls);

        // Для каждого URL получаем самую последнюю ошибку
        const latestErrorsPromises = errorUrls.map(url => 
          this.supabase
            .from('parse_error')
            .select('*')
            .eq('url', url)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        );

        const latestErrorsResults = await Promise.all(latestErrorsPromises);
        
        // Фильтруем успешные результаты и создаем мапу
        const handledStatusMap = new Map(
          latestErrorsResults
            .filter(result => result.data !== null)
            .map(result => {
              const data = result.data!; // Safe to use ! because of filter above
              return [data.url, { is_handled: data.is_handled, error_msg: data.error_msg }];
            })
        );

        console.log('Found latest errors:', 
          Object.fromEntries(handledStatusMap.entries())
        );

        const newErrors = report.errors.parsing.map(error => {
          const existingData = handledStatusMap.get(error.url);
          console.log(`Latest status for ${error.url}:`, existingData);
          
          return {
            error_msg: error.error,
            client_error_msg: error.clientErrorMessage,
            course_title: error.title,
            url: error.url,
            type: 'parsing',
            report_id: data.id,
            is_handled: existingData?.error_msg === error.error ? existingData.is_handled : false
          };
        });

        console.log('Inserting new errors:', newErrors);

        const { error: insertError, data: insertedErrors } = await this.supabase
          .from('parse_error')
          .insert(newErrors)
          .select();

        if (insertError) {
          console.error('Error inserting new errors:', insertError);
          throw new DatabaseError({
            error: insertError.message,
            clientErrorMessage: "Не удалось сохранить ошибки парсинга"
          });
        }

        console.log('Successfully inserted errors:', insertedErrors);
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