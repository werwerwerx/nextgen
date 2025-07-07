import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminAuth } from "@/lib/auth/admin-check";

export const dynamic = "force-dynamic";

type TAdditionalCourseData = {
  description?: string;
  tariff_prices?: {
    title: 'LIGHT' | 'PRO' | 'PRO MAX' | 'CONSULTING';
    price: string;
  }[];
  title: string;
  url: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ error_id: string }> }
) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck) return authCheck;

    const { error_id } = await params;
    const { description, tariff_prices, title, url }: TAdditionalCourseData = await request.json();

    if (!title || !url) {
      return NextResponse.json({ 
        success: false,
        error: "Название курса и URL обязательны для заполнения" 
      }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: ParseErrorToUpdate, error: parseErrorError } = await supabase
      .from("parse_error")
      .select("*")
      .eq("id", Number(error_id))
      .single();

    if (parseErrorError) {
      console.error("Ошибка при получении данных об ошибке парсинга:", parseErrorError);
      return NextResponse.json({ 
        success: false,
        error: "Ошибка парсинга не найдена или произошла ошибка при получении данных" 
      }, { status: 404 });
    }

    if (!ParseErrorToUpdate) {
      return NextResponse.json({ 
        success: false,
        error: "Ошибка парсинга не найдена" 
      }, { status: 404 });
    }

    const { data: existingCourse, error: existingCourseError } = await supabase
      .from("cources")
      .select("*")
      .eq("origin_url", url)
      .single();

    if (existingCourseError && existingCourseError.code !== 'PGRST116') {
      console.error("Ошибка при проверке существующего курса:", existingCourseError);
      return NextResponse.json({ 
        success: false,
        error: "Ошибка при проверке существующего курса" 
      }, { status: 500 });
    }

    const courseData = {
      course_name: title,
      origin_url: url,
      type: ParseErrorToUpdate.type || "NEW",
      description: description || "",
      tariff_price: tariff_prices || null,
      is_active: true,
    };

    let course;
    if (existingCourse) {
      const { data: updatedCourse, error: updateError } = await supabase
        .from("cources")
        .update(courseData)
        .eq("id", existingCourse.id)
        .select()
        .single();
      
      if (updateError) {
        console.error("Ошибка при обновлении курса:", updateError);
        return NextResponse.json({ 
          success: false,
          error: "Не удалось обновить данные курса" 
        }, { status: 500 });
      }
      course = updatedCourse;
    } else {
      const { data: newCourse, error: insertError } = await supabase
        .from("cources")
        .insert(courseData)
        .select()
        .single();
      
      if (insertError) {
        console.error("Ошибка при создании нового курса:", insertError);
        return NextResponse.json({ 
          success: false,
          error: "Не удалось создать новый курс" 
        }, { status: 500 });
      }
      course = newCourse;
    }

    const { error: updateError } = await supabase
      .from("parse_error")
      .update({ 
        is_handled: true as const,
        created_course_id: course.id 
      })
      .eq("id", Number(error_id));

    if (updateError) {
      console.error("Ошибка при обновлении статуса ошибки парсинга:", updateError);
      return NextResponse.json({ 
        success: false,
        error: "Не удалось обновить статус ошибки парсинга" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data: course,
      message: `Курс "${course.course_name}" успешно ${existingCourse ? 'обновлен' : 'создан'}` 
    });
  } catch (error) {
    console.error("Критическая ошибка при обработке запроса:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Произошла непредвиденная ошибка при обработке запроса" 
      },
      { status: 500 }
    );
  }
} 