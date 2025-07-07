import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/auth/admin-check";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const supabase = createAdminClient();
    const { is_active } = await request.json();
    const { id } = await params;
    
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: "is_active must be a boolean" },
        { status: 400 }
      );
    }

    const { data: course, error } = await supabase
      .from("cources")
      .update({ is_active })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating course:", error);
      return NextResponse.json(
        { error: "Failed to update course" },
        { status: 500 }
      );
    }

    // Инвалидируем кэш страницы курсов
    revalidatePath('/courses');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ 
      success: true, 
      course,
      message: `Курс "${course.course_name}" ${is_active ? 'активирован' : 'деактивирован'}`
    });
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const supabase = createAdminClient();
    const { id } = await params;
    
    const { data: course, error } = await supabase
      .from("cources")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

