import { PageContainer } from "@/components/continer";
import { SectionHeading } from "@/components/ui/typography";
import { Database } from "@/lib/supabase/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadSection } from "@/components/dashboard/lead-section";
import { ReportsSection } from "@/components/dashboard/reports-section";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { LeadsChart } from "@/components/dashboard/leads-chart";
import { TelegramSection } from "@/components/dashboard/telegram-section";

// Дашборд должен быть полностью динамическим
export const revalidate = 0;
export const dynamic = 'force-dynamic';

type ReportWithErrors = Database["public"]["Tables"]["parse_report"]["Row"] & {
  errors: Database["public"]["Tables"]["parse_error"]["Row"][];
};

type LeadWithCourse = Database["public"]["Tables"]["leads"]["Row"] & {
  course_name?: string | null;
};

type SectionData = {
  reports?: ReportWithErrors[];
  leads?: LeadWithCourse[];
  courses?: Database["public"]["Tables"]["cources"]["Row"][];
  error?: string;
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const data: SectionData = {};
  
  try {
    const [
      reportsResult,
      errorsResult,
      leadsResult,
      userCoursesResult,
      coursesResult
    ] = await Promise.all([
      supabase.from("parse_report").select("*"),
      supabase.from("parse_error").select("*"),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("user_course").select("lead_id, course_id"),
      supabase.from("cources").select("*").order("created_at", { ascending: false })
    ]);

    if (reportsResult.error) {
      console.error("Ошибка при загрузке отчетов:", reportsResult.error);
      data.error = "Не удалось загрузить отчеты";
    }

    if (errorsResult.error) {
      console.error("Ошибка при загрузке ошибок парсинга:", errorsResult.error);
      data.error = "Не удалось загрузить ошибки парсинга";
    }

    if (leadsResult.error) {
      console.error("Ошибка при загрузке лидов:", leadsResult.error);
      data.error = "Не удалось загрузить данные о лидах";
    }

    if (userCoursesResult.error) {
      console.error("Ошибка при загрузке курсов пользователей:", userCoursesResult.error);
      data.error = "Не удалось загрузить данные о курсах пользователей";
    }

    if (coursesResult.error) {
      console.error("Ошибка при загрузке курсов:", coursesResult.error);
      data.error = "Не удалось загрузить список курсов";
    }

    const reports = reportsResult.data || [];
    const report_errors = errorsResult.data || [];
    const leads = leadsResult.data || [];
    const userCourses = userCoursesResult.data || [];
    const courses = coursesResult.data || [];

    console.log("Parse errors with is_handled=true:", report_errors?.filter(e => e.is_handled).length);
    console.log("Total parse errors:", report_errors?.length);

    const reportsWithErrors: ReportWithErrors[] =
      reports?.map((report) => ({
        ...report,
        errors: (report_errors || []).filter(
          (error) => error.report_id === report.id
        ),
      })) || [];

    const courseMap = new Map();
    courses?.forEach((course) => {
      courseMap.set(course.id, course.course_name);
    });

    const leadCourseMap = new Map();
    userCourses?.forEach((uc) => {
      if (uc.lead_id && uc.course_id) {
        const courseName = courseMap.get(uc.course_id);
        if (courseName) {
          leadCourseMap.set(uc.lead_id, courseName);
        }
      }
    });

    const leadsWithCourses: LeadWithCourse[] =
      leads?.map((lead) => ({
        ...lead,
        course_name: leadCourseMap.get(lead.id) || null,
      })) || [];

    data.reports = reportsWithErrors;
    data.leads = leadsWithCourses;
    data.courses = courses;

  } catch (error) {
    console.error("Критическая ошибка при загрузке данных:", error);
    data.error = "Произошла ошибка при загрузке данных. Пожалуйста, обновите страницу или попробуйте позже.";
  }

  return (
    <PageContainer className="py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <SectionHeading>Панель управления</SectionHeading>
          <p className="text-muted-foreground">
            Обзор активности и управление системой
          </p>
        </div>

        {data.error ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p>{data.error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Аналитика</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <LeadsChart leads={data.leads || []} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Telegram Уведомления</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <TelegramSection />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Управление лидами</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <LeadSection leads={data.leads || []} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Управление курсами</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <CoursesSection courses={data.courses || []} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Отчеты и логи</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <ReportsSection reports={data.reports || []} />
            </section>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
