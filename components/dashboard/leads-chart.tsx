"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database } from "@/lib/supabase/database.types";
import { TrendingUp, CalendarDays } from "lucide-react";

type LeadWithCourse = Database["public"]["Tables"]["leads"]["Row"] & {
  course_name?: string | null;
};

interface LeadsChartProps {
  leads: LeadWithCourse[];
}

interface ChartDataPoint {
  date: string;
  count: number;
  fullDate: Date;
}

function generateDateRange(days: number): Date[] {
  const dates: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  return dates;
}

function groupLeadsByDate(leads: LeadWithCourse[]): Map<string, ChartDataPoint> {
  return leads.reduce((acc, lead) => {
    const leadDate = new Date(lead.created_at);
    const dateKey = leadDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    
    if (!acc.has(dateKey)) {
      acc.set(dateKey, {
        date: dateKey,
        count: 0,
        fullDate: new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate())
      });
    }
    
    const existing = acc.get(dateKey)!;
    existing.count += 1;
    
    return acc;
  }, new Map<string, ChartDataPoint>());
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const value = payload[0].value;
  const isZero = value === 0;

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="font-medium">{label}</p>
      <p className={isZero ? "text-muted-foreground" : "text-primary"}>
        <span className="font-medium">{value}</span> {value === 1 ? 'заявка' : value < 5 ? 'заявки' : 'заявок'}
      </p>
      {isZero && (
        <p className="text-xs text-muted-foreground mt-1">Заявок не было</p>
      )}
    </div>
  );
}

export function LeadsChart({ leads }: LeadsChartProps) {
  const chartData = useMemo(() => {
    const DAYS_TO_SHOW = 30;
    
    const dateRange = generateDateRange(DAYS_TO_SHOW);
    
    const groupedLeads = groupLeadsByDate(leads);
    
    const completeData = dateRange.map(date => {
      const dateKey = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      });
      
      const existingData = groupedLeads.get(dateKey);
      
      return {
        date: dateKey,
        count: existingData?.count || 0,
        fullDate: date
      };
    });

    return completeData;
  }, [leads]);

  const totalLeads = leads.length;
  const daysWithData = chartData.filter(day => day.count > 0).length;
  const avgPerDay = chartData.length > 0 ? (totalLeads / chartData.length).toFixed(1) : '0';
  const maxPerDay = chartData.length > 0 ? Math.max(...chartData.map(d => d.count)) : 0;
  
  const periodStart = chartData.length > 0 ? chartData[0].fullDate : new Date();
  const periodEnd = chartData.length > 0 ? chartData[chartData.length - 1].fullDate : new Date();
  const periodText = `${periodStart.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${periodEnd.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Динамика заявок
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {periodText}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 text-sm">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-primary">{totalLeads}</div>
            <div className="text-muted-foreground text-xs sm:text-sm">Всего</div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{avgPerDay}</div>
            <div className="text-muted-foreground text-xs sm:text-sm">Средн./день</div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{daysWithData}</div>
            <div className="text-muted-foreground text-xs sm:text-sm">Актив.дни</div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{maxPerDay}</div>
            <div className="text-muted-foreground text-xs sm:text-sm">Макс/день</div>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 12,
                right: 12,
                left: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted"
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip 
                content={<CustomTooltip />}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorCount)"
                dot={(props) => {
                  const { payload, cx, cy, index } = props;
                  if (payload?.count === 0) {
                    return (
                      <circle
                        key={`dot-zero-${index}`}
                        cx={cx}
                        cy={cy}
                        r={2}
                        fill="hsl(var(--muted-foreground))"
                        opacity={0.3}
                      />
                    );
                  }
                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="hsl(var(--primary))"
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    />
                  );
                }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Нет данных для отображения</p>
          </div>
        </div>
      )}
    </div>
  );
} 