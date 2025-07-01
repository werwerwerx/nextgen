import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validate } from "@/lib/utils";
import {
  TGETLeadResponse,
  TLeadInfo,
  TPOSTLeadResponse,
  leadFormShema,
} from "@/features/lead/lead-request/shared";



export async function POST(request: NextRequest) {
  console.log('🟡 POST /api/leads - Start');
  const leadData = (await request.json()) as TLeadInfo;
  console.log('📝 Received lead data:', leadData);
  
  const validationErrors = validate(leadData, leadFormShema);
  if (validationErrors) {
    console.log('❌ Validation errors:', validationErrors);
    const validationErrorResponse = {
      success: false,
      errorMessage: "Пожалуйста, проверьте правильность заполнения формы",
      errors: validationErrors,
    };
    console.log('📤 Sending validation error response:', validationErrorResponse);
    return NextResponse.json<TPOSTLeadResponse>(
      validationErrorResponse,
      { status: 422 }
    );
  }
  console.log('✅ Validation passed');

  const supabase = await createClient();
  let [isEmailUsed, isPhoneUsed] = [false, false];
  if (leadData.email && leadData.phone) {
    console.log('🔍 Checking both email and phone');
    const [userByEmail, userByPhone] = await Promise.all([
      supabase.from("leads").select("*").eq("email", leadData.email).single(),
      supabase.from("leads").select("*").eq("phone", leadData.phone).single(),
    ]);
    isEmailUsed = userByEmail.data ? true : false;
    isPhoneUsed = userByPhone.data ? true : false;
  } else if (leadData.email) {
    console.log('🔍 Checking email');
    const userByEmail = await supabase
      .from("leads")
      .select("*")
      .eq("email", leadData.email)
      .single();
    isEmailUsed = userByEmail.data ? true : false;
  } else if (leadData.phone) {
    console.log('🔍 Checking phone');
    const userByPhone = await supabase
      .from("leads")
      .select("*")
      .eq("phone", leadData.phone)
      .single();
    isPhoneUsed = userByPhone.data ? true : false;
  }

  console.log('📊 Check results:', { isEmailUsed, isPhoneUsed });

  const errorMessage: string | undefined =
    isEmailUsed && isPhoneUsed
      ? "Пользователь с таким email или номером телефона уже отправлял заявку"
      : isEmailUsed
      ? "Такой email уже зарегистрирован"
      : isPhoneUsed
      ? "Такой номер телефона уже зарегистрирован"
      : undefined;

  if (errorMessage) {
    console.log('❌ Duplicate found:', errorMessage);
    const errorResponse = {
      success: false,
      errorMessage,
    };
    console.log('📤 Sending error response:', errorResponse);
    return NextResponse.json<TPOSTLeadResponse>(
      errorResponse,
      { status: 422 }
    );
  }

  const generatedUtm = {
    utm_source: "nextgen",
    utm_campaign: "lead",
    utm_content: leadData.interest || "general",
    timestamp: new Date().toISOString(),
  };
  
  const insertData = {
    ...leadData,
    email: leadData.email || null,
    phone: leadData.phone || null,
    interest: leadData.interest || null,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip"),
    utm: generatedUtm,
  };
  console.log('📤 Inserting data:', insertData);

  const { error } = await supabase
    .from("leads")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('❌ Insert error:', error);
    return NextResponse.json<TPOSTLeadResponse>(
      {
        success: false,
        errorMessage:
          "Не удалось сохранить данные. Пожалуйста, попробуйте позже",
      },
      { status: 500 }
    );
  }

  console.log('✅ Lead successfully saved');
  return NextResponse.json<TPOSTLeadResponse>({
    success: true,
    successMessage: "Данные успешно сохранены",
  });
}

export async function GET() {
  console.log('🟡 GET /api/leads - Start');
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error('❌ GET error:', error);
    return NextResponse.json<TGETLeadResponse>(
      {
        success: false,
        errorMessage: "Не удалось получить данные. Пожалуйста, попробуйте позже",
      }
    );
  }

  console.log('✅ GET success, leads count:', leads?.length);
  return NextResponse.json<TGETLeadResponse>({
    success: true,
    data: leads,
    successMessage: "Данные успешно загружены"
  }); 
}
