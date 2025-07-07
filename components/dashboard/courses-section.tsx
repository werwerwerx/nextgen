"use client";

import { Database } from "@/lib/supabase/database.types";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, BookOpen, Loader2, Check, X, Search, Filter } from "lucide-react";

type Course = Database["public"]["Tables"]["cources"]["Row"];

interface CoursesSectionProps {
  courses: Course[];
  onCourseUpdate?: (courseId: number, isActive: boolean) => void;
}

export function CoursesSection({ courses, onCourseUpdate }: CoursesSectionProps) {
  const [loadingCourses, setLoadingCourses] = useState<Set<number>>(new Set());
  const [courseStates, setCourseStates] = useState<Record<number, boolean>>(
    courses.reduce((acc, course) => {
      acc[course.id] = course.is_active;
      return acc;
    }, {} as Record<number, boolean>)
  );
  
  // Фильтрация и пагинация
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'MAIN' | 'NEW'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const toggleCourseStatus = async (courseId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    setLoadingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCourseStates(prev => ({
          ...prev,
          [courseId]: newStatus,
        }));
        
        alert(result.message || `Курс ${newStatus ? 'активирован' : 'деактивирован'}`);
        
        if (onCourseUpdate) {
          onCourseUpdate(courseId, newStatus);
        }
      } else {
        alert(result.error || 'Не удалось обновить статус курса');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Произошла ошибка при обновлении курса');
    } finally {
      setLoadingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  // Фильтрация курсов
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course =>
        statusFilter === 'active' ? courseStates[course.id] : !courseStates[course.id]
      );
    }

    // Фильтрация по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter(course => course.type === typeFilter);
    }

    return filtered;
  }, [courses, searchTerm, statusFilter, typeFilter, courseStates]);

  // Пагинация
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize);

  const activeCourses = courses.filter(course => courseStates[course.id]);
  const inactiveCourses = courses.filter(course => !courseStates[course.id]);

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Управление курсами
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Активные: {activeCourses.length}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Скрытые: {inactiveCourses.length}
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск курсов по названию или описанию..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value: typeof statusFilter) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Скрытые</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={typeFilter} 
            onValueChange={(value: typeof typeFilter) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="MAIN">Основные</SelectItem>
              <SelectItem value="NEW">Новые</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Показано {startIndex + 1}-{Math.min(startIndex + pageSize, filteredCourses.length)} из {filteredCourses.length} курсов
          </span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedCourses.map((course) => {
          const isActive = courseStates[course.id];
          const isLoading = loadingCourses.has(course.id);
          
          return (
            <div
              key={course.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                isActive 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground">{course.course_name}</h4>
                    {course.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>ID: {course.id}</span>
                      <span>Тип: {course.type}</span>
                      <span>Обновлен: {new Date(course.updated_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {isActive ? 'Активен' : 'Скрыт'}
                </div>
                
                <Button
                  variant={isActive ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleCourseStatus(course.id, isActive)}
                  disabled={isLoading}
                  className={`min-w-[100px] ${
                    isActive 
                      ? 'border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isActive ? 'Скрыть' : 'Показать'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Назад
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-muted-foreground">...</span>;
                }
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}

      {filteredCourses.length === 0 && courses.length > 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Нет курсов, соответствующих фильтрам</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Нет доступных курсов</p>
        </div>
      ) : null}
    </div>
  );
} 