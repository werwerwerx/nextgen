import { Database } from "@/lib/supabase/database.types";
import { BookOpen, Eye, EyeOff } from "lucide-react";

type Course = Database["public"]["Tables"]["cources"]["Row"];

interface StatsCardsProps {
  leadsCount: number;
  courses: Course[];
}

export function StatsCards({ leadsCount, courses }: StatsCardsProps) {
  const activeCourses = courses.filter(course => course.is_active);
  const inactiveCourses = courses.filter(course => !course.is_active);
  const mainCourses = courses.filter(course => course.type === 'MAIN');
  const newCourses = courses.filter(course => course.type === 'NEW');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Заявки</h3>
        <p className="text-3xl font-bold text-primary mb-1">{leadsCount}</p>
        <p className="text-sm text-muted-foreground">
          Всего заявок
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Курсы
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Всего:</span>
            <span className="text-2xl font-bold text-primary">{courses.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Основные:</span>
            <span className="font-medium">{mainCourses.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Новые:</span>
            <span className="font-medium">{newCourses.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          Активные
        </h3>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-green-600 mb-1">{activeCourses.length}</p>
          <p className="text-sm text-muted-foreground">
            Видимые на сайте
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <EyeOff className="h-5 w-5 text-red-600" />
          Скрытые
        </h3>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-red-600 mb-1">{inactiveCourses.length}</p>
          <p className="text-sm text-muted-foreground">
            Не отображаются на сайте
          </p>
        </div>
      </div>
    </div>
  );
} 