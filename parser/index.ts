import type { CourseLink, MainCourse, NewCource } from "./shared/course";
import { HtmlLoaderService } from "./services/html-loader.service";
import { CourseLinksHtmlRepository } from "./repositories/course-links.html-repository";
import { CourseHtmlRepository } from "./repositories/cource.html-repository";
import { CourceService } from "./services/cource.service";
import { CourseDbRepository } from "./repositories/course.db.repository";
import { DatabaseError, ParseError, ParseReport } from "./shared/report";
import { ReportRepository } from "./repositories/report.repository";
import { supabase } from "./config/db";
import { CourceInstallmentPlanHTMLRepository } from "./repositories/cource.installment-plan.html.repository";

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
  const courceInstallmentPlanHTMLRepository =
    new CourceInstallmentPlanHTMLRepository();
  try {
    const courceService = new CourceService(
      courseLinkRepository,
      htmlLoader,
      courseHtmlRepository,
      courceInstallmentPlanHTMLRepository
    );
    const parseStartTime = Date.now();
    const courses = await courceService.visitLinks();
    report.performance.totalParseTime = Date.now() - parseStartTime;
    report.stats.totalLinksParsed = courses.length;
    report.performance.averageParseTime = courses.length
      ? report.performance.totalParseTime / courses.length
      : 0;

    if (courses.length === 0) {
      console.error("No courses found to save");
      return report;
    }

    try {
      const dbStartTime = Date.now();
      const saved = await courseDbRepository.saveCourses(courses);
      console.log(`Successfully saved courses to database in ${Date.now() - dbStartTime}ms`);
      report.stats.updatedInDb = saved ? saved.length : 0;
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error("Database operation failed:", {
          originalError: error.message,
          clientMessage: error.clientErrorMessage,
          coursesCount: courses.length,
          timestamp: new Date().toISOString()
        });
        report.errors.database = error;
      } else {
        const errorMessage = error instanceof Error ? error.message : "Unknown database error";
        console.error("Unexpected database error:", {
          error: errorMessage,
          type: typeof error,
          coursesCount: courses.length,
          timestamp: new Date().toISOString()
        });
        report.errors.other = errorMessage;
      }
    }
  } catch (error) {
    if (error instanceof ParseError) {
      report.errors.parsing.push({
        url: error.url,
        title: error.title,
        error: error.message,
        clientErrorMessage: error.clientErrorMessage,
      });
    } else {
      report.errors.other =
        error instanceof Error ? error.message : "Unknown error";
    }
  } finally {
    report.duration = Date.now() - startTime;
    await reportRepository.saveReport(report);
  }

  return report;
}

// Example usage
start()
  .then((report) => {
    console.log("\n🎉 PARSING COMPLETED!");
    console.log("⏱️  Total duration:", report.duration, "ms");
    console.log("📊 Stats:");
    console.log("   • Courses parsed:", report.stats.totalLinksParsed);
    console.log("   • Courses saved to DB:", report.stats.updatedInDb);
    console.log("   • Average parse time:", Math.round(report.performance.averageParseTime), "ms/course");
    
    if (report.errors.parsing.length > 0) {
      console.log("\n⚠️  PARSING ERRORS:", report.errors.parsing.length);
      report.errors.parsing.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.title || error.url}`);
        console.log(`      Error: ${error.error}`);
      });
    }
    
    if (report.errors.database) {
      console.log("\n❌ DATABASE ERROR SUMMARY:");
      console.log("   Client Message:", report.errors.database.clientErrorMessage);
      console.log("   Technical Details:", report.errors.database.message);
      console.log("   📊 Courses attempted to save:", report.stats.totalLinksParsed);
      console.log("   💾 Courses actually saved:", report.stats.updatedInDb);
    }
    
    if (report.errors.other) {
      console.log("\n🚨 OTHER ERROR:", report.errors.other);
    }
    
    if (!report.errors.database && !report.errors.other && report.errors.parsing.length === 0) {
      console.log("\n✅ All operations completed successfully!");
    }
  })
  .catch((error) => {
    console.error("Failed to run parser:", error);
  });
