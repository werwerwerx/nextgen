"use client";

import { Database } from "@/lib/supabase/database.types";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown, Search, Filter, Calendar, AlertCircle } from "lucide-react";

type ReportWithErrors = Database["public"]["Tables"]["parse_report"]["Row"] & {
  errors: Database["public"]["Tables"]["parse_error"]["Row"][];
};

interface ReportsSectionProps {
  reports: ReportWithErrors[];
}

type SortField = 'id' | 'created_at' | 'total_courses_parsed' | 'total_updated' | 'errors_count';
type SortDirection = 'asc' | 'desc';

export function ReportsSection({ reports }: ReportsSectionProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorFilter, setErrorFilter] = useState<'all' | 'with_errors' | 'without_errors'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const filteredReports = useMemo(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toString().includes(searchTerm) ||
        report.duration?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (errorFilter !== 'all') {
      filtered = filtered.filter(report => 
        errorFilter === 'with_errors' 
          ? report.errors.length > 0 
          : report.errors.length === 0
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const reportDate = new Date();
      
      filtered = filtered.filter(report => {
        const createdAt = new Date(report.created_at);
        const diffTime = now.getTime() - createdAt.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today':
            return diffDays <= 1;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [reports, searchTerm, errorFilter, dateFilter]);

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (sortField === 'errors_count') {
        aValue = a.errors.length;
        bValue = b.errors.length;
      } else if (sortField === 'created_at') {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredReports, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedReports.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = sortedReports.slice(startIndex, startIndex + pageSize);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          {children}
          {sortField === field && (
            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    </TableHead>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string | null) => {
    if (!duration) return "-";
    
    const ms = parseInt(duration);
    if (isNaN(ms)) return duration;
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const displayHours = hours;
    const displayMinutes = minutes % 60;
    const displaySeconds = seconds % 60;
    
    if (displayHours > 0) {
      return `${displayHours}ч ${displayMinutes}м ${displaySeconds}с`;
    } else if (displayMinutes > 0) {
      return `${displayMinutes}м ${displaySeconds}с`;
    } else {
      return `${displaySeconds}с`;
    }
  };

  const ErrorCell = ({ errors }: { errors: Database["public"]["Tables"]["parse_error"]["Row"][] }) => {
    if (errors.length === 0) {
      return <span className="text-green-600">0</span>;
    }

    const errorMessages = errors.map(error => error.client_error_msg || 'Неизвестная ошибка').join('\n');

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-red-600 cursor-help">
              <AlertCircle className="h-4 w-4" />
              {errors.length}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <div className="space-y-1">
              <p className="font-medium">Ошибки парсинга:</p>
              <div className="text-sm whitespace-pre-line">
                {errorMessages}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Отчеты о парсинге</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Всего: {filteredReports.length}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по ID или продолжительности..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={errorFilter} onValueChange={(value: typeof errorFilter) => setErrorFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все отчеты</SelectItem>
              <SelectItem value="with_errors">С ошибками</SelectItem>
              <SelectItem value="without_errors">Без ошибок</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={(value: typeof dateFilter) => setDateFilter(value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все время</SelectItem>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedReports.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="id">ID</SortableHeader>
                  <SortableHeader field="created_at">Дата создания</SortableHeader>
                  <SortableHeader field="total_courses_parsed">Курсов</SortableHeader>
                  <SortableHeader field="total_updated">Обновлено</SortableHeader>
                  <TableHead>Продолжительность</TableHead>
                  <SortableHeader field="errors_count">Ошибки</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{formatDate(report.created_at)}</TableCell>
                    <TableCell>{report.total_courses_parsed || 0}</TableCell>
                    <TableCell>{report.total_updated || 0}</TableCell>
                    <TableCell>{formatDuration(report.duration)}</TableCell>
                    <TableCell>
                      <ErrorCell errors={report.errors} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Показано {startIndex + 1}-{Math.min(startIndex + pageSize, sortedReports.length)} из {sortedReports.length}
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
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
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
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {filteredReports.length === 0 && reports.length > 0 
            ? "Нет отчетов, соответствующих фильтрам" 
            : "Нет отчетов о парсинге"
          }
        </div>
      )}
    </div>
  );
} 