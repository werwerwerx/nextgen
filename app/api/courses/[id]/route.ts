import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    const { is_active } = await request.json();
    
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: "is_active must be a boolean" },
        { status: 400 }
      );
    }

    const { data: course, error } = await supabase
      .from("cources")
      .update({ is_active })
      .eq("id", Number(params.id))
      .select()
      .single();

    if (error) {
      console.error("Error updating course:", error);
      return NextResponse.json(
        { error: "Failed to update course" },
        { status: 500 }
      );
    }

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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    
    const { data: course, error } = await supabase
      .from("cources")
      .select("*")
      .eq("id", Number(params.id))
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