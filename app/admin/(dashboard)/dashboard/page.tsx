import { PageContainer } from "@/components/continer";
import { SectionHeading } from "@/components/ui/typography";
import { Database } from "@/lib/supabase/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    .select("id, course_name");

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
      <div className="max-w-6xl mx-auto">
        <SectionHeading className="mb-8">Панель управления</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Заявки</h3>
            <p className="text-sm text-muted-foreground">
              Всего заявок: {leadsWithCourses.length}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Курсы</h3>
            <p className="text-sm text-muted-foreground">
              Управление курсами и контентом
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Аналитика</h3>
            <p className="text-sm text-muted-foreground">Статистика и отчеты</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Заявки пользователей</h3>
          {leadsWithCourses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Курс</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Дата создания</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsWithCourses.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email || "-"}</TableCell>
                    <TableCell>{lead.phone || "-"}</TableCell>
                    <TableCell>
                      {lead.course_name || "Не определился"}
                    </TableCell>
                    <TableCell>{lead.ip || "-"}</TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleString("ru-RU")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Нет заявок</p>
          )}
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Отчеты о парсинге</h3>
          {reportsWithErrors.length > 0 ? (
            <div className="space-y-4">
              {reportsWithErrors.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">ID: {report.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Курсов: {report.total_courses_parsed || 0}</div>
                    <div>Обновлено: {report.total_updated || 0}</div>
                  </div>
                  {report.errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      Ошибок: {report.errors.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Нет отчетов о парсинге</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
