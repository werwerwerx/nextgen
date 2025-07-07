import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadResponse, TLeadData, validateLead } from "./shared";

export async function POST(
  request: NextRequest
): Promise<NextResponse<LeadResponse>> {
  const leadData = (await request.json()) as TLeadData;
  const supabase = await createClient();
  const errors = validateLead(leadData);
  if (errors) {
    return NextResponse.json({
      success: false,
      errorMessage: JSON.stringify(errors),
      clientErrorMessage: "Некорректные данные",
    });
  }

  const [{ data: userByPhone }, { data: userByEmail }] = await Promise.all([
    supabase.from("leads").select("*").eq("phone", leadData.phone).single(),
    supabase.from("leads").select("*").eq("email", leadData.email).single(),
  ]);

  if (userByPhone || userByEmail) {
    return NextResponse.json({
      success: false,
      errorMessage: "Contact already exists",
      clientErrorMessage: "Контакт уже существует",
    });
  }

  const { data: leadSaved, error } = await supabase
    .from("leads")
    .insert({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    })
    .select()
    .single();
  if (!leadSaved) {
    return NextResponse.json({
      success: false,
      errorMessage: error.message,
      clientErrorMessage: "Упс! Что-то пошло не так. Попробуйте позже.",
    });
  }

  if (leadData.courseInterestedInId) {
    const { data: userCourseSaved, error: userCourseError } = await supabase
      .from("user_course")
      .insert({
        course_id: leadData.courseInterestedInId,
        lead_id: leadSaved.id,
      });
    if (userCourseError) {
      return NextResponse.json({
        success: false,
        errorMessage: userCourseError.message,
        clientErrorMessage: "Упс! Что-то пошло не так. Попробуйте позже.",
      });
    }
  }

  return NextResponse.json({
    success: true,
    data: leadSaved,
  });
}
