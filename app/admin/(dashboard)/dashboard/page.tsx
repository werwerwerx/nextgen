import { PageContainer } from "@/components/continer";
import { SectionHeading } from "@/components/ui/typography";
import { Database } from "@/lib/supabase/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadSection } from "@/components/dashboard/lead-section";
import { ReportsSection } from "@/components/dashboard/reports-section";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { LeadsChart } from "@/components/dashboard/leads-chart";
import { TelegramSection } from "@/components/dashboard/telegram-section";

type ReportWithErrors = Database["public"]["Tables"]["parse_report"]["Row"] & {
  errors: Database["public"]["Tables"]["parse_error"]["Row"][];
};

type LeadWithCourse = Database["public"]["Tables"]["leads"]["Row"] & {
  course_name?: string | null;
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const { data: reports, error: reportsError } = await supabase
    .from("parse_report")
    .select("*");
  const { data: report_errors, error: errorsError } = await supabase
    .from("parse_error")
    .select("*");

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: userCourses } = await supabase
    .from("user_course")
    .select("lead_id, course_id");

  const { data: courses } = await supabase
    .from("cources")
    .select("*")
    .order("created_at", { ascending: false });

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

  return (
    <PageContainer className="py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <SectionHeading>Панель управления</SectionHeading>
          <p className="text-muted-foreground">
            Обзор активности и управление системой
          </p>
        </div>

        <StatsCards leadsCount={leadsWithCourses.length} courses={courses || []} />

        <div className="space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Аналитика</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <LeadsChart leads={leadsWithCourses} />
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
            <LeadSection leads={leadsWithCourses} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Управление курсами</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <CoursesSection courses={courses || []} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Отчеты и логи</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <ReportsSection reports={reportsWithErrors} />
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
