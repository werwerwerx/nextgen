import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAuth } from "@/lib/auth/admin-check";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck) return authCheck;

    const supabase = await createClient();
    const url = new URL(request.url);
    const reportId = url.searchParams.get('report_id');

    if (reportId && isNaN(Number(reportId))) {
      return NextResponse.json({ 
        success: false,
        error: "Некорректный ID отчета" 
      }, { status: 400 });
    }

    let query = supabase
      .from("parse_error")
      .select("*")
      .order("created_at", { ascending: false });

    if (reportId) {
      query = query.eq("report_id", Number(reportId));
    }

    // Only return unhandled errors
    query = query.is('is_handled', false);

    const { data: errors, error } = await query;

    if (error) {
      console.error("Ошибка при получении списка ошибок парсинга:", error);
      return NextResponse.json({ 
        success: false,
        error: "Не удалось загрузить список ошибок парсинга" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: errors || [],
      message: errors?.length 
        ? `Найдено ${errors.length} необработанных ошибок парсинга` 
        : "Необработанные ошибки парсинга отсутствуют"
    });
  } catch (error) {
    console.error("Критическая ошибка при получении списка ошибок:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Произошла непредвиденная ошибка при получении списка ошибок" 
      },
      { status: 500 }
    );
  }
}