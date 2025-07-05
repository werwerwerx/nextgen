import type { CourseLink, MainCourse, NewCource } from "./types/course";
import { HtmlLoaderService } from "./services/html-loader.service";
import { CourseLinksHtmlRepository } from "./repositories/course-links.html-repository";
import { CourseHtmlRepository } from "./repositories/cource.html-repository";
import { CourceService } from "./services/cource.service";
import { CourseDbRepository } from "./repositories/course.db.repository";
import { DatabaseError, ParseError, ParseReport } from "./types/report";
import { ReportRepository } from "./repositories/report.repository";
import { supabase } from "./config/db";

export async function start(): Promise<ParseReport> {
  const startTime = Date.now();
  const report: ParseReport = {
    duration: 0,
    stats: {
      totalLinksParsed: 0,
      updatedInDb: 0,
    },
    errors: {
      parsing: [],
    },
    performance: {
      averageParseTime: 0,
      totalParseTime: 0,
    },
  };

  const htmlLoader = new HtmlLoaderService();
  const courseLinkRepository = new CourseLinksHtmlRepository();
  const courseHtmlRepository = new CourseHtmlRepository();
  const courseDbRepository = new CourseDbRepository(supabase);
  const reportRepository = new ReportRepository(supabase);

  try {
    const courceService = new CourceService(courseLinkRepository, htmlLoader, courseHtmlRepository);
    const parseStartTime = Date.now();
    const courses = await courceService.visitLinks();
    report.performance.totalParseTime = Date.now() - parseStartTime;
    report.stats.totalLinksParsed = courses.length;
    report.performance.averageParseTime = courses.length ? report.performance.totalParseTime / courses.length : 0;

    if (courses.length === 0) {
      console.error('No courses found to save');
      return report;
    }

    try {
      const dbStartTime = Date.now();
      const saved = await courseDbRepository.saveCourses(courses);
      
    } catch (error) {
      if (error instanceof DatabaseError) {
        report.errors.database = error;
      } else {
        report.errors.other = error instanceof Error ? error.message : 'Unknown database error';
      }
    }
  } catch (error) {
    if (error instanceof ParseError) {
      report.errors.parsing.push({
        url: error.url,
        title: error.title,
        error: error.message,
        clientErrorMessage: error.clientErrorMessage
      });
    } else {
      report.errors.other = error instanceof Error ? error.message : 'Unknown error';
    }
  } finally {
    report.duration = Date.now() - startTime;
    await reportRepository.saveReport(report);
  }

  return report;
}

// Example usage
start().then(report => {
  console.log('Parsing completed in', report.duration, 'ms');
  console.log('Stats:', report.stats);
  if (report.errors.parsing.length > 0) {
    console.log('Parsing errors:', report.errors.parsing);
  }
  if (report.errors.database) {
    console.log('Database error:', report.errors.database.clientErrorMessage);
  }
  if (report.errors.other) {
    console.log('Other error:', report.errors.other);
  }
}).catch(error => {
  console.error('Failed to run parser:', error);
}); 