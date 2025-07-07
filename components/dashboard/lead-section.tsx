"use client";

import { Database } from "@/lib/supabase/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

type LeadWithCourse = Database["public"]["Tables"]["leads"]["Row"] & {
  course_name?: string | null;
};

interface LeadSectionProps {
  leads: LeadWithCourse[];
}

type SortField = 'name' | 'email' | 'phone' | 'course_name' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function LeadSection({ leads }: LeadSectionProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Функция сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Отсортированные данные
  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any = a[sortField];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any = b[sortField];
      
      if (sortField === 'course_name') {
        aValue = a.course_name || '';
        bValue = b.course_name || '';
      }
      
      if (sortField === 'created_at') {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, sortField, sortDirection]);

  // Пагинация
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = sortedLeads.slice(startIndex, startIndex + itemsPerPage);

  // Функция для экранирования CSV полей
  const escapeCSVField = (field: string): string => {
    if (field == null) return '';
    
    const stringField = String(field);
    
    // Если поле содержит кавычки, запятые или переносы строк, экранируем его
    if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
      // Удваиваем кавычки для экранирования согласно RFC 4180
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    
    return stringField;
  };

  // Экспорт в CSV
  const exportToCSV = () => {
    const headers = ['Имя', 'Email', 'Телефон', 'Курс', 'IP', 'Дата создания'];
    const csvData = [
      headers,
      ...sortedLeads.map(lead => [
        lead.name,
        lead.email || '',
        lead.phone || '',
        lead.course_name || 'Не определился',
        lead.ip || '',
        new Date(lead.created_at).toLocaleString("ru-RU")
      ])
    ];
    
    const csvContent = csvData.map(row => 
      row.map(field => escapeCSVField(field)).join(',')
    ).join('\n');
    
    // Добавляем BOM для корректного отображения кириллицы в Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Компонент для заголовка с сортировкой
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </TableHead>
  );

  const CourseCell = ({ courseName }: { courseName: string | null | undefined }) => {
    const displayText = courseName || "Не определился";
    const isLong = displayText.length > 40;
    const truncatedText = isLong ? `${displayText.substring(0, 40)}...` : displayText;

    if (isLong) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <div className="truncate max-w-[200px] text-sm">
                  {truncatedText}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-[300px] break-words"
            >
              <p>{displayText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div className="truncate max-w-[200px] text-sm">
        {displayText}
      </div>
    );
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Заявки пользователей ({leads.length})</h3>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Экспорт CSV
        </Button>
      </div>
      {leads.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="name">Имя</SortableHeader>
                  <SortableHeader field="email">Email</SortableHeader>
                  <SortableHeader field="phone">Телефон</SortableHeader>
                  <TableHead className="w-[200px]">
                    <div className="cursor-pointer hover:bg-accent/50 transition-colors rounded p-1 -m-1" onClick={() => handleSort('course_name')}>
                      <div className="flex items-center gap-1">
                        Курс
                        {sortField === 'course_name' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">IP</TableHead>
                  <SortableHeader field="created_at">Дата создания</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email || "-"}</TableCell>
                    <TableCell>{lead.phone || "-"}</TableCell>
                    <TableCell className="w-[200px]">
                      <CourseCell courseName={lead.course_name} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm w-[100px]">
                      {lead.ip || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(lead.created_at).toLocaleString("ru-RU")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-muted-foreground">
                Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedLeads.length)} из {sortedLeads.length} заявок
              </div>
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
        </>
      ) : (
        <p className="text-muted-foreground">Нет заявок</p>
      )}
    </div>
  );
} 